import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonLoading, IonToast, IonTitle } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import { home, shareSocial, book, ellipsisHorizontal, ellipsisVertical, arrowBack, bookmark } from 'ionicons/icons';
import { Bookmark } from '../models/Bookmark';
import { DictItem } from '../models/DictItem';

interface Props {
  dispatch: Function;
  loadingTwdData: boolean;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
  keyword: string;
}> { }

interface State {
  keyword: string;
  search: DictItem | null;
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

  ionViewWillEnter() {
    //console.log( 'view will enter' );
    //console.log(this.props.match.url);
    //console.log(this.props.history.length);
    if (this.props.match.params.keyword) {
      this.setState({ keyword: this.props.match.params.keyword });
    }
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
    const res = Globals.dictItems.find((dictItem) => dictItem.通關簽審文件編號 === keyword) || null;
    this.setState({ search: res });
  }

  addBookmarkHandler() {
    const drugId = this.state.search!.通關簽審文件編號;
    this.props.dispatch({
      type: "ADD_BOOKMARK",
      bookmark: new Bookmark({
        uuid: drugId,
        中文品名: this.state.search!.中文品名,
      }),
    });
    this.setState({ showToast: true, toastMessage: '書籤新增成功！' });
    return;
  }

  getSelectedString() {
    const sel = document.getSelection();
    if ((sel?.rangeCount || 0) > 0 && sel!.getRangeAt(0).toString().length > 0) {
      return sel!.getRangeAt(0).toString();
    } else {
      return '';
    }
  }

  selectedTextBeforeIonPopover = '';
  render() {

    if (!this.props.loadingTwdData && this.state.search == null) {
      this.lookupDict(this.props.match.params.keyword);
    }

    let dictView: any = [];
    if (this.props.match.params.keyword && this.state.search != null) {
      const search = this.state.search!;
      DictItem.sortedKeys.forEach((key, index) => {
        const value = (search as any)[key];
        dictView.push(<IonItem key={`contentItem` + index}
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
