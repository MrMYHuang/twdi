import { isPlatform, IonLabel } from '@ionic/react';
import * as AdmZip from 'adm-zip';
import { DownloaderHelper, Stats } from 'node-downloader-helper';
import { DictItem } from './models/DictItem';

const twdDataUrl = `https://myhdata.s3.ap-northeast-1.amazonaws.com/全部藥品許可證資料集.zip`;
const twdiDb = 'twdiDb';
const twdDataKey = 'twdData';
let log = '';

var dictItems: Array<DictItem> = [];

async function downloadTwdData(progressCallback: Function) {
  return new Promise((ok, fail) => {
    let twdData: any;
    const dl = new DownloaderHelper(Globals.twdDataUrl, '.');
    let progressUpdateEnable = true;
    dl.on('progress', (stats: Stats) => {
      if (progressUpdateEnable) {
        // Reduce number of this calls by progressUpdateEnable.
        // Too many of this calls could result in 'end' event callback is executed before 'progress' event callbacks!
        progressCallback(stats.progress);
        progressUpdateEnable = false;
        setTimeout(() => {
          progressUpdateEnable = true;
        }, 100);
      }
    });
    dl.on('end', (downloadInfo: any) => {
      dl.removeAllListeners();
      const zip = new AdmZip.default(downloadInfo.filePath);
      const zipEntry = zip.getEntries()[0];
      twdData = JSON.parse(zipEntry.getData().toString("utf8"));
      ok(twdData);
    });
    dl.start();
  });
}

function getFileName(work: string, juan: string) {
  return `${work}_juan${juan}.html`;
}

async function getFileFromIndexedDB(fileName: string) {
  const dbOpenReq = indexedDB.open(twdiDb);

  return new Promise(function (ok, fail) {
    dbOpenReq.onsuccess = async function (ev) {
      const db = dbOpenReq.result;

      const trans = db.transaction(["store"], 'readwrite');
      let req = trans.objectStore('store').get(fileName);
      req.onsuccess = async function (_ev) {
        const data = req.result;
        if (!data) {
          console.error(`${fileName} loading failed!`);
          console.error(new Error().stack);
          return fail();
        }
        return ok(data);
      };
    };
  });
}

async function saveFileToIndexedDB(fileName: string, data: any) {
  const dbOpenReq = indexedDB.open(twdiDb);
  return new Promise<void>((ok, fail) => {
    dbOpenReq.onsuccess = async (ev: Event) => {
      const db = dbOpenReq.result;

      const transWrite = db.transaction(["store"], 'readwrite')
      const reqWrite = transWrite.objectStore('store').put(data, fileName);
      reqWrite.onsuccess = (_ev: any) => ok();
      reqWrite.onerror = (_ev: any) => fail();
    };
  });
}

async function removeFileFromIndexedDB(fileName: string) {
  const dbOpenReq = indexedDB.open(twdiDb);
  return new Promise<void>((ok, fail) => {
    try {
      dbOpenReq.onsuccess = (ev: Event) => {
        const db = dbOpenReq.result;

        const transWrite = db.transaction(["store"], 'readwrite')
        try {
          const reqWrite = transWrite.objectStore('store').delete(fileName);
          reqWrite.onsuccess = (_ev: any) => ok();
          reqWrite.onerror = (_ev: any) => fail();
        } catch (err) {
          console.error(err);
        }
      };
    } catch (err) {
      fail(err);
    }
  });
}

async function clearIndexedDB() {
  const dbOpenReq = indexedDB.open(twdiDb);
  return new Promise<void>((ok, fail) => {
    dbOpenReq.onsuccess = async (ev: Event) => {
      const db = dbOpenReq.result;

      const transWrite = db.transaction(["store"], 'readwrite')
      const reqWrite = transWrite.objectStore('store').clear();
      reqWrite.onsuccess = (_ev: any) => ok();
      reqWrite.onerror = (_ev: any) => fail();
    };
  });
}

async function clearAppData() {
  localStorage.clear();
  await clearIndexedDB();
}

//const electronBackendApi: any = (window as any).electronBackendApi;

function removeElementsByClassName(doc: Document, className: string) {
  let elements = doc.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode?.removeChild(elements[0]);
  }
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

const webkit = (window as any).webkit;
function copyToClipboard(text: string) {
  if (isMacCatalyst()) {
    (webkit as any).messageHandlers.swiftCallbackHandler.postMessage({
      event: 'copy',
      text
    })
  } else {
    navigator.clipboard && navigator.clipboard.writeText(text);
  }
}

function isMacCatalyst() {
  return isPlatform('ios') && navigator.platform === 'MacIntel';
}

function zhVoices() {
  return speechSynthesis.getVoices().filter(v => ['zh-TW', 'zh_TW', 'zh-CN', 'zh_CN', 'zh-HK', 'zh_HK'].some(name => v.localService && v.lang.indexOf(name) > -1));
}

const Globals = {
  storeFile: 'Settings.json',
  fontSizeNorm: 24,
  fontSizeLarge: 48,
  downloadTwdData,
  getLog,
  enableAppLog,
  disableAppLog,
  twdiDb,
  twdDataUrl,
  twdDataKey,
  appSettings: {
    'theme': '佈景主題',
    'uiFontSize': 'UI字型大小',
    'fontSize': '內容字型大小',
  } as Record<string, string>,
  fetchErrorContent: (
    <div className='contentCenter'>
      <IonLabel>
        <div>
          <div>連線失敗!</div>
          <div style={{ fontSize: 'var(--ui-font-size)', paddingTop: 24 }}>如果問題持續發生，請執行<a href="/settings" target="_self">設定頁</a>的app異常回報功能。</div>
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
    document.documentElement.style.cssText = `--ion-font-family: 'Times, Heiti TC, Noto Sans CJK TC'; --ui-font-size: ${settings.uiFontSize}px; --text-font-size: ${settings.fontSize}px`
  },
  isMacCatalyst,
  isTouchDevice: () => {
    return (isPlatform('ios') && !isMacCatalyst()) || isPlatform('android');
  },
  dictItems,
  getFileName,
  getFileFromIndexedDB,
  saveFileToIndexedDB,
  removeFileFromIndexedDB,
  clearAppData,
  removeElementsByClassName,
  disableAndroidChromeCallout,
  disableIosSafariCallout,
  copyToClipboard,
  zhVoices,
};

export default Globals;
