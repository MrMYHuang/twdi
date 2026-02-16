import { isPlatform, IonLabel } from '@ionic/react';
import { unzipSync } from 'fflate';
import IndexedDbFuncs from './IndexedDbFuncs';
import { ChineseHerbItem } from './models/ChineseHerbItem';
import { DictItem } from './models/DictItem';

const baseUrl = import.meta.env.BASE_URL || '/';
const pwaUrl = baseUrl.replace(/\/$/, '');
const bugReportApiUrl = 'https://vh6ud1o56g.execute-api.ap-northeast-1.amazonaws.com/bugReportMailer';
let twdDataUrl = `https://d1dhau3ezqw0u0.cloudfront.net/全部藥品許可證資料集.zip`;
let twchDataUrl = `https://d23fxcqevt3np7.cloudfront.net/中藥藥品許可證資料集.zip`;

const twdiDb = 'twdiDb';
const twdDataKey = 'twdData';
const twchDataKey = 'twchData';
let log = '';

var dictItems: Array<DictItem> = [];
var chineseHerbsItems: Array<ChineseHerbItem> = [];

async function downloadTwdData(url: string, progressCallback: Function) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  const total = Number(response.headers.get('content-length') || 0);
  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  if (reader) {
    progressCallback(0);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          progressCallback((received / total) * 100);
        }
      }
    }
  } else {
    const buffer = await response.arrayBuffer();
    chunks.push(new Uint8Array(buffer));
  }

  const size = chunks.reduce((sum, c) => sum + c.length, 0);
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }

  const files = unzipSync(data);
  const firstKey = Object.keys(files)[0];
  if (!firstKey) {
    throw new Error('Zip archive is empty.');
  }
  const jsonText = new TextDecoder('utf-8').decode(files[firstKey]);
  const twdData = JSON.parse(jsonText);
  progressCallback(100);
  return twdData;
}

//const electronBackendApi: any = (window as any).electronBackendApi;

async function clearAppData() {
  localStorage.clear();
  await IndexedDbFuncs.clear();
}

const consoleLog = console.log.bind(console);
const consoleError = console.error.bind(console);

function getLog() {
  return log;
}

function enableAppLog() {
  console.log = function () {
    log += '----- Info ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleLog.apply(console, arguments as any);
  };

  console.error = function () {
    log += '----- Error ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleError.apply(console, arguments as any);
  };
}

function disableAppLog() {
  log = '';
  console.log = consoleLog;
  console.error = consoleError;
}

function disableAndroidChromeCallout(event: any) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

// Workable but imperfect.
function disableIosSafariCallout(this: Window, event: any) {
  const s = this.getSelection();
  if ((s?.rangeCount || 0) > 0) {
    const r = s?.getRangeAt(0);
    s?.removeAllRanges();
    setTimeout(() => {
      s?.addRange(r!);
    }, 50);
  }
}

//const webkit = (window as any).webkit;
function copyToClipboard(text: string) {
  try {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'clipboard-read' } as any).then(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard && navigator.clipboard.writeText(text);
    }
  } catch (error) {
    console.error(error);
  }
}

function shareByLink(dispatch: Function, url: string = window.location.href) {
  copyToClipboard(url);
  dispatch({
    type: 'TMP_SET_KEY_VAL',
    key: 'shareTextModal',
    val: {
      show: true,
      text: decodeURIComponent(url),
    },
  });
}

function isMacCatalyst() {
  return isPlatform('ios') && navigator.platform === 'MacIntel';
}

const checkServiceWorkerInterval = 20;
let serviceWorkerLoaded = false;
let _serviceWorkerReg: ServiceWorkerRegistration;
async function getServiceWorkerReg() {
  if (serviceWorkerLoaded) { 
    return _serviceWorkerReg;
  }

  return new Promise<ServiceWorkerRegistration>((ok, fail) => {
    let waitTime = 0;
    const waitLoading = setInterval(() => {
      if (navigator.serviceWorker.controller != null) {
        clearInterval(waitLoading);
        ok(_serviceWorkerReg);
      } else if (waitTime > 1e3 * 10) {
        clearInterval(waitLoading);
        fail('getServiceWorkerReg timeout!');
      }
      waitTime += checkServiceWorkerInterval;
    }, checkServiceWorkerInterval);
  });
}
function setServiceWorkerReg(serviceWorkerReg: ServiceWorkerRegistration) {
  _serviceWorkerReg = serviceWorkerReg;
}

let _serviceWorkerRegUpdated: ServiceWorkerRegistration;
function getServiceWorkerRegUpdated() {
  return _serviceWorkerRegUpdated;
}
function setServiceWorkerRegUpdated(serviceWorkerRegUpdated: ServiceWorkerRegistration) {
  _serviceWorkerRegUpdated = serviceWorkerRegUpdated;
}

// Migrate old store file to new one.
const oldStoreFile = 'Settings.json';
const newStoreFile = 'twdiSettings.json';
const savedSettingsStr = localStorage.getItem(oldStoreFile);
if (savedSettingsStr != null) {
  localStorage.setItem(newStoreFile, savedSettingsStr);
  localStorage.removeItem(oldStoreFile);
}

const Globals = {
  pwaUrl,
  bugReportApiUrl,
  storeFile: newStoreFile,
  downloadTwdData,
  getLog,
  enableAppLog,
  disableAppLog,
  twdiDb,
  durgResources: [
    { item: "離線西藥資料", dataKey: twdDataKey, url: twdDataUrl },
    { item: "離線中藥資料", dataKey: twchDataKey, url: twchDataUrl },
  ],
  appSettings: {
    'theme': '佈景主題',
    'uiFontSize': 'UI 字型大小',
    'fontSize': '內容字型大小',
  } as Record<string, string>,
  fetchErrorContent: (
    <div className='contentCenter'>
      <IonLabel>
        <div>
          <div>連線失敗!</div>
          <div style={{ fontSize: 'var(--ui-font-size)', paddingTop: 24 }}>如果問題持續發生，請執行<a href={`${pwaUrl}/settings`} target="_self">設定頁</a>的 app 異常回報功能。</div>
        </div>
      </IonLabel>
    </div>
  ),
  updateApp: () => {
    return new Promise(async resolve => {
      navigator.serviceWorker.getRegistrations().then(async regs => {
        const hasUpdates = await Promise.all(regs.map(reg => (reg.update() as any).then((newReg: ServiceWorkerRegistration) => {
          return newReg.installing !== null || newReg.waiting !== null;
        })));
        resolve(hasUpdates.reduce((prev, curr) => prev || curr, false));
      });
    });
  },
  updateCssVars: (settings: any) => {
    document.documentElement.style.cssText = `--ui-font-size: ${settings.uiFontSize}px; --text-font-size: ${settings.fontSize}px`
  },
  isMacCatalyst,
  isTouchDevice: () => {
    return (isPlatform('ios') && !isMacCatalyst()) || isPlatform('android');
  },
  isStoreApps: () => {
    return isPlatform('pwa') || isPlatform('electron');
  },
  dictItems,
  chineseHerbsItems,
  clearAppData,
  disableAndroidChromeCallout,
  disableIosSafariCallout,
  copyToClipboard,
  shareByLink,
  setServiceWorkerReg,
  getServiceWorkerReg,
  setServiceWorkerRegUpdated,
  getServiceWorkerRegUpdated,
};

export default Globals;
