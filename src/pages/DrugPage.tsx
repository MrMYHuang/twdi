import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonList, IonItem, IonLabel, IonLoading, IonToast, IonTitle } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import { shareSocial, arrowBack, bookmark } from 'ionicons/icons';
import { Bookmark } from '../models/Bookmark';
import { DictItem } from '../models/DictItem';
import { ChineseHerbItem } from '../models/ChineseHerbItem';

interface Props {
  dispatch: Function;
  loadingTwdData: boolean;
}

interface PageProps extends Props, RouteComponentProps<{
  path: string;
  tab: string;
  mode: string;
  keyword: string;
}> { }

interface State {
  keyword: string;
  search: DictItem | ChineseHerbItem | null;
  showNoSelectedTextAlert: boolean;
  popover: any;
  showToast: boolean;
  toastMessage: string;
}

class _DrugPage extends React.Component<PageProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      keyword: '',
      search: null,
      showNoSelectedTextAlert: false,
      popover: {
        show: false,
        event: null,
      },
      showToast: false,
      toastMessage: '',
    }
  }

  mode = '';
  ionViewWillEnter() {
    //console.log( 'view will enter' );
    //console.log(this.props.match.url);
    //console.log(this.props.history.length);
    this.mode = this.props.match.params.mode;
    if (this.props.match.params.keyword) {
      this.setState({ keyword: this.props.match.params.keyword });
    }
    this.lookupDict(this.props.match.params.keyword);
  }

  componentDidMount() {
    //console.log(`did mount: ${this.props.match.url}`);
  }

  ionViewWillLeave() {
  }

  get isTopPage() {
    return this.props.match.url === `/${this.props.match.params.tab}`;
  }

  async lookupDict(keyword: string) {
    const chineseHerbIdPattern = new RegExp(`.*${keyword}`)
    const res = (this.mode !== 'chineseHerb' ? Globals.dictItems.find((dictItem) => dictItem.通關簽審文件編號 === keyword) : Globals.chineseHerbsItems.find((dictItem) => chineseHerbIdPattern.test(dictItem.許可證字號))) || null;
    this.setState({ search: res });
  }

  addBookmarkHandler() {
    const search = this.state.search!;
    const drugId = this.mode !== 'chineseHerb' ? (search as DictItem).通關簽審文件編號 : (search as ChineseHerbItem).許可證字號;
    const name = this.mode !== 'chineseHerb' ? (search as DictItem).中文品名 : (search as ChineseHerbItem).藥品名稱;
    this.props.dispatch({
      type: "ADD_BOOKMARK",
      bookmark: new Bookmark({
        uuid: drugId,
        中文品名: name,
        isChineseHerb: this.mode === 'chineseHerb'
      }),
    });
    this.setState({ showToast: true, toastMessage: '書籤新增成功！' });
    return;
  }

  loadingTwdDataOld = true;
  render() {
    if (this.loadingTwdDataOld && !this.props.loadingTwdData) {
      this.lookupDict(this.props.match.params.keyword);
    }
    this.loadingTwdDataOld = this.props.loadingTwdData;

    let dictView: any = [];
    if (this.props.match.params.keyword && this.state.search != null) {
      const search = this.state.search!;
      (this.mode !== 'chineseHerb' ? DictItem : ChineseHerbItem).sortedKeys.forEach((key, index) => {
        const value = (search as any)[key];
        dictView.push(
          <IonItem button={true} key={`contentItem` + index}
            onClick={async event => {
              event.preventDefault();
              Globals.copyToClipboard(value);
              this.setState({ showToast: true, toastMessage: `複製"${key}"成功` })
            }}>
            <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
            <IonLabel className='ion-text-wrap textFont' key={`contentItemlabel_` + index}>
              {key}: {value}
            </IonLabel>
          </IonItem>
        )
      });
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
              <IonIcon icon={arrowBack} slot='icon-only' />
            </IonButton>

            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>藥品資料</IonTitle>

            <IonButton fill="clear" slot='end' onClick={e => {
              this.props.dispatch({
                type: "TMP_SET_KEY_VAL",
                key: 'shareTextModal',
                val: {
                  show: true,
                  text: decodeURIComponent(window.location.href),
                },
              });
            }}>
              <IonIcon icon={shareSocial} slot='icon-only' />
            </IonButton>

            <IonButton hidden={this.props.loadingTwdData} fill="clear" slot='end' onClick={e => {
              this.setState({ popover: { show: false, event: null } });
              this.addBookmarkHandler();
            }}>
              <IonIcon icon={bookmark} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          <IonLoading
            cssClass='uiFont'
            isOpen={this.props.loadingTwdData}
            message={'載入中...'}
          />

          <IonList key='contentList1'>
            {dictView}
          </IonList>

          <IonToast
            cssClass='uiFont'
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            message={this.state.toastMessage}
            duration={2000}
          />
        </IonContent>
      </IonPage>
    );
  }
};

const DrugPage = withIonLifeCycle(_DrugPage);

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    loadingTwdData: state.tmpSettings.loadingTwdData,
  };
};


//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(DrugPage);
