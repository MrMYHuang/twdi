import React from 'react';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonAlert,
  IonToast,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { connect, Provider } from 'react-redux';
import queryString from 'query-string';
import getSavedStore from './redux/store';
import { bookmark, settings, search } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import SettingsPage from './pages/SettingsPage';
import BookmarkPage from './pages/BookmarkPage';
import Globals from './Globals';
import DictionaryPage from './pages/DictionaryPage';
import ShareTextModal from './components/ShareTextModal';
import DownloadModal from './components/DownloadModal';
import DrugPage from './pages/DrugPage';
import { Settings } from './models/Settings';
import IndexedDbFuncs from './IndexedDbFuncs';

const electronBackendApi: any = (window as any).electronBackendApi;

let store = getSavedStore();
/*
class DebugRouter extends IonReactRouter {
  constructor(props: any) {
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null, 2))
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
    });
  }
}
*/

setupIonicReact({
  mode: 'md', // Use a consistent UI style across Android and iOS.
  swipeBackEnabled: false,
});

export var serviceWorkCallbacks = {
  onLoad: function (registration: ServiceWorkerRegistration) { },
  onSuccess: function (registration: ServiceWorkerRegistration) { },
  onUpdate: function (registration: ServiceWorkerRegistration) { },
};

interface Props {
  dispatch: Function;
  shareTextModal: any;
  settings: Settings;
}

interface PageProps extends RouteComponentProps<{
  tab: string;
  path: string;
}> { }

interface AppOrigProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
}> { }

interface State {
  showToast: boolean;
  toastMessage: string;
  showUpdateAlert: boolean;
  showRestoreAppSettingsToast: boolean;
  downloadModal: any;
}

class _App extends React.Component<PageProps> {
  render() {
    return (
      <Provider store={store}>
        <AppOrig {...this.props} />
      </Provider>
    );
  }
}

class _AppOrig extends React.Component<AppOrigProps, State> {
  registrationNew: ServiceWorkerRegistration | null;
  originalAppSettingsStr: string | null | undefined;

  constructor(props: any) {
    super(props);
    if (!this.props.settings.hasAppLog) {
      Globals.disableAppLog();
    }

    electronBackendApi?.receive("fromMain", (data: any) => {
      switch (data.event) {
        case 'version':
          this.props.dispatch({
            type: "TMP_SET_KEY_VAL",
            key: 'mainVersion',
            val: data.version,
          });
          break;
      }
    });
    electronBackendApi?.send("toMain", { event: 'ready' });

    this.registrationNew = null;

    // ----- Initializing UI settings -----
    // Apply the theme setting.
    while (document.body.classList.length > 0) {
      document.body.classList.remove(document.body.classList.item(0)!);
    }
    document.body.classList.toggle(`theme${this.props.settings.theme}`, true);

    // Modify UI settings from query string.
    const queryParams = queryString.parse(this.props.location.search) as any;
    if (queryParams.settings) {
      this.originalAppSettingsStr = localStorage.getItem(Globals.storeFile);
      (queryParams.settings as string).split(',').forEach(setting => {
        const keyVal = setting.split('=');
        this.props.dispatch({
          type: "SET_KEY_VAL",
          key: keyVal[0],
          val: +keyVal[1],
        });
      });
    }
    Globals.updateCssVars(this.props.settings);

    this.state = {
      showUpdateAlert: false,
      showRestoreAppSettingsToast: (queryParams.settings != null && this.originalAppSettingsStr != null) || false,
      showToast: false,
      toastMessage: '',
      downloadModal: { progress: 0, show: false }
    };

    serviceWorkCallbacks.onUpdate = (registration: ServiceWorkerRegistration) => {
      this.registrationNew = registration;
      this.setState({ showUpdateAlert: true });
    };

    serviceWorkCallbacks.onSuccess = (registration: ServiceWorkerRegistration) => {
    };

    // Preload speechSynthesis.
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.getVoices();
      speechSynthesis.cancel();
    }

    // Enable screen wake lock.
    if ((navigator as any).wakeLock) {
      this.wakeLockScreen();
      document.addEventListener("visibilitychange", async () => {
        if (document.visibilityState === 'visible') {
          this.wakeLockScreen();
        } else {
          this.wakeLockScreenRelease()
        }
      });
    }

    IndexedDbFuncs.open().then(() => {
      console.log(`IndexedDB opened.`);

      if (this.props.settings.appInitialized) {
        this.loadTwdData();
      }
    });
  }

  restoreAppSettings() {
    localStorage.setItem(Globals.storeFile, this.originalAppSettingsStr!);
    this.props.dispatch({ type: 'LOAD_SETTINGS' });
  }

  async loadTwdData() {
    this.props.dispatch({
      type: "TMP_SET_KEY_VAL",
      key: 'loadingTwdData',
      val: true,
    });
    let twdData: any;
    for (let i = 0; i < Globals.durgResources.length; i++) {
      let item = Globals.durgResources[i];
      try {
        twdData = await IndexedDbFuncs.getFile(item.dataKey);
      } catch (err) {
        twdData = await Globals.downloadTwdData(item.url, async (progress: number) => {
        });
        IndexedDbFuncs.saveFile(item.dataKey, twdData);
      }

      if (i === 0) {
        Globals.dictItems = twdData;
      } else {
        Globals.chineseHerbsItems = twdData;
      }
    }
    this.props.dispatch({
      type: "TMP_SET_KEY_VAL",
      key: 'loadingTwdData',
      val: false,
    });
  }

  // Prevent device from sleeping.
  wakeLock: any;
  async wakeLockScreen() {
    try {
      const wakeLock = (navigator as any).wakeLock;
      if (wakeLock != null) {
        this.wakeLock = await wakeLock.request('screen');
        console.log('Screen wake lock is requested.');
      } else {
        console.error('navigator.wakeLock is undefined.');
      }
    } catch (err: any) {
      // the wake lock request fails - usually system related, such low as battery
      console.log(`${err.name}, ${err.message}`);
      console.log(new Error().stack);
    }
  }

  async wakeLockScreenRelease() {
    if (this.wakeLock != null) {
      await this.wakeLock.release();
      this.wakeLock = null;
      console.log('Screen wake lock is released.');
    }
  }

  routeByQueryString() {
    // This app uses client side routing. 
    // Without the first loading of this app,
    // any client side route becomes a server side route!
    // These invalid server side routings cause 404 errors.
    // To workaround these errors, we can use GitHub 404.html redirection
    // to pass the client side routes to this app by using query string.
    // After this app loads, it can use the query string to correctly redirect to
    // a client side route!
    console.log(window.location.search);
    const routeMatches = /route=([^&]*)/.exec(window.location.search);
    const queryMatches = /query=([^&]*)/.exec(window.location.search);
    if (routeMatches !== null) {
      const route = decodeURIComponent(routeMatches[1]);

      let query = ''
      if (queryMatches !== null) {
        query = decodeURIComponent(queryMatches[1]);
      }
      return <Redirect to={`${Globals.pwaUrl}` + route + query} />;
    } else if (window.location.pathname === `${Globals.pwaUrl}/` || window.location.pathname === `${Globals.pwaUrl}`) {
      return <Redirect to={`${Globals.pwaUrl}/bookmarks`} />;
    }
  }

  componentDidMount() {
    const now = new Date();
    const drugDataDownloadDate = new Date(this.props.settings.drugDataDownloadDate);
    const timeDiff = now.getTime() - drugDataDownloadDate.getTime();
    if (this.props.settings.alertUpdateDrugData &&
      (timeDiff > 1000 * 60 * 60 * 24 * 30)) {
      this.setState({ showToast: true, toastMessage: `離線藥品資料已 30 天未更新，可至設定頁更新。` });
    }
  }

  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet animated={false}>
              {/* The following route is for backward compatibility. */}
              <Route path={`${Globals.pwaUrl}/:tab(bookmarks)`} render={(props: any) => <BookmarkPage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/:tab(dictionary)/:mode(search)/:keyword?`} render={(props: any) => <DictionaryPage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/:tab(dictionary)/:mode(searchCH)/:keyword?`} render={(props: any) => <DictionaryPage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/:tab(dictionary)/:mode(drug)/:keyword?`} render={(props: any) => <DrugPage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/:tab(dictionary)/:mode(chineseHerb)/:keyword?`} render={(props: any) => <DrugPage {...props} />} exact={true} />
              <Route path={`${Globals.pwaUrl}/settings`} render={(props: any) => <SettingsPage {...props} />} />
              <Route path={`${Globals.pwaUrl}/`} render={() => { return this.routeByQueryString(); }} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="bookmarks" href={`${Globals.pwaUrl}/bookmarks`}>
                <IonIcon icon={bookmark} />
              </IonTabButton>
              <IonTabButton tab="dictionay" href={`${Globals.pwaUrl}/dictionary/search`}>
                <IonIcon icon={search} />
              </IonTabButton>
              <IonTabButton tab="settings" href={`${Globals.pwaUrl}/settings`}>
                <IonIcon icon={settings} />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
        <IonAlert
          cssClass='uiFont'
          isOpen={this.state.showUpdateAlert}
          backdropDismiss={false}
          onDidPresent={async (ev) => {
            // Run SKIP_WAITING at onDidPresent event to avoid a race condition of
            // an old page fetching old JS chunks with a new service worker!
            try {
              (await Globals.getServiceWorkerReg()).installing?.postMessage({ type: 'SKIP_WAITING' });
              (await Globals.getServiceWorkerReg()).waiting?.postMessage({ type: 'SKIP_WAITING' });
            } catch (error) {
              console.error(error);
            }

            Globals.getServiceWorkerRegUpdated().installing?.postMessage({ type: 'SKIP_WAITING' });
            Globals.getServiceWorkerRegUpdated().waiting?.postMessage({ type: 'SKIP_WAITING' });
          }}
          header={'App 已更新，請重啟!'}
          buttons={[
            {
              text: '關閉',
              cssClass: 'primary uiFont',
              handler: (value) => {
                this.setState({
                  showUpdateAlert: false,
                });
              },
            },
          ]}
        />

        <IonAlert
          cssClass='uiFont'
          backdropDismiss={false}
          isOpen={!this.props.settings.appInitialized}
          header='初次啟動'
          message='須下載離線資料，請按確定以繼續'
          buttons={[
            {
              text: '確定',
              cssClass: 'primary uiFont',
              handler: async (value) => {
                await this.loadTwdData();
                this.props.dispatch({
                  type: "SET_KEY_VAL",
                  key: 'appInitialized',
                  val: true,
                });
              },
            },
          ]}
        />

        <ShareTextModal
          {...{
            text: this.props.shareTextModal?.text,
            showModal: this.props.shareTextModal?.show || false,
            finish: () => {
              this.props.dispatch({
                type: "TMP_SET_KEY_VAL",
                key: 'shareTextModal',
                val: { show: false },
              });
            }, ...this.props
          }}
        />

        <DownloadModal
          {...{
            item: this.state.downloadModal.item,
            progress: this.state.downloadModal.progress,
            showModal: this.state.downloadModal.show,
            ...this.props
          }}
        />

        <IonToast
          cssClass='uiFont'
          isOpen={this.state.showRestoreAppSettingsToast}
          onDidDismiss={() => this.setState({ showRestoreAppSettingsToast: false })}
          message={`已套用 app 連結中的設定，是否還原設定？`}
          buttons={[
            {
              text: '取消',
              role: 'cancel',
              handler: () => this.setState({ showRestoreAppSettingsToast: false })
            },
            {
              text: '還原',
              handler: () => this.restoreAppSettings(),
            },
          ]}
        />

        <IonToast
          cssClass='uiFont'
          isOpen={this.state.showToast}
          onDidDismiss={() => this.setState({ showToast: false })}
          message={this.state.toastMessage}
          duration={2000}
        />
      </IonApp>
    );
  }
}

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    shareTextModal: state.tmpSettings.shareTextModal,
    settings: state.settings,
  }
};

const AppOrig = connect(
  mapStateToProps,
)(_AppOrig);


const App = withRouter(_App);

export default App;
