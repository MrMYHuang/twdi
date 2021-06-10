import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonSearchbar, IonAlert, IonPopover, IonList, IonItem, IonLabel, IonLoading, IonToast, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import { home, shareSocial, ellipsisHorizontal, ellipsisVertical, refreshCircle, arrowBack } from 'ionicons/icons';
import { DictItem } from '../models/DictItem';

interface Props {
  dispatch: Function;
  loadingTwdData: boolean;
  dictionaryHistory: Array<string>;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  path: string;
  keyword: string;
}> { }

interface State {
  keyword: string;
  searches: Array<DictItem>;
  showNoSelectedTextAlert: boolean;
  popover: any;
  isScrollOn: boolean;
  isLoading: boolean;
  fetchError: boolean;
  showToast: boolean;
  toastMessage: string;
}

class _DictionaryPage extends React.Component<PageProps, State> {
  searchBarRef: React.RefObject<HTMLIonSearchbarElement>;
  filteredData: Array<DictItem>;
  constructor(props: any) {
    super(props);
    this.state = {
      keyword: '',
      searches: [],
      showNoSelectedTextAlert: false,
      popover: {
        show: false,
        event: null,
      },
      isScrollOn: false,
      isLoading: false,
      fetchError: false,
      showToast: false,
      toastMessage: '',
    }
    this.searchBarRef = React.createRef<HTMLIonSearchbarElement>();
    this.filteredData = [];
  }

  ionViewWillEnter() {
    //console.log(`${this.props.match.url} will enter`);
    const keyword = this.props.match.params.keyword;
    this.setState({ keyword: keyword });
  }

  /*
  componentDidMount() {
    //console.log(`did mount: ${this.props.match.url}`);
  }
  
  componentWillUnmount() {
    console.log(`${this.props.match.url} unmount`);
  }

  ionViewWillLeave() {
  }
  */

  get isTopPage() {
    return this.props.match.params.keyword === undefined;
  }

  page = 0;
  rows = 20;
  async search(keyword: string, newSearch: boolean = false) {
    if (newSearch) {
      const re = new RegExp(`.*${this.props.match.params.keyword}.*`);
      this.filteredData = Globals.dictItems.filter((dictItem) =>
      dictItem.通關簽審文件編號 != null && (re.test(dictItem.中文品名) || re.test(dictItem.英文品名) || re.test(dictItem.通關簽審文件編號) || re.test(dictItem.製造商名稱) || re.test(dictItem.主成分略述))
      );
      this.page = 0;
    }

    console.log(`Loading page ${this.page}`);

    const searches = this.filteredData.slice(this.page * this.rows, (this.page + 1) * this.rows);

    this.page += 1;
    this.setState({
      fetchError: false, isLoading: false, searches: newSearch ? searches : [...this.state.searches, ...searches],
      isScrollOn: this.state.searches.length < this.filteredData.length,
    });

    if (newSearch) {
      this.props.dictionaryHistory.unshift(keyword);
      this.props.dictionaryHistory.splice(10);
      this.props.dispatch({
        type: "SET_KEY_VAL",
        key: 'dictionaryHistory',
        val: this.props.dictionaryHistory,
      });
    }
    return true;
  }

  getRows() {
    const data = this.state.searches as [DictItem];
    let rows = Array<object>();
    data.forEach((item: DictItem, index: number) => {
      const drugId = item.通關簽審文件編號;
      rows.push(
        <IonItem key={`dictItem` + index}
          onClick={async event => {
            event.preventDefault();
            this.props.history.push({
              pathname: `/dictionary/drug/${drugId}`,
            });
          }}>
          <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
          <IonLabel className='ion-text-wrap uiFont' key={`bookmarkItemLabel_` + index}>
            {item.中文品名}
          </IonLabel>
        </IonItem>
      );
    });
    return rows;
  }

  render() {
    if (!this.props.loadingTwdData) {
      if (this.props.match.params.keyword != null && this.props.match.params.keyword === this.state.keyword) {
        if (this.state.searches.length === 0 && this.page === 0) {
          this.search(this.props.match.params.keyword, true);
        }
      }
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton hidden={this.isTopPage} fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
              <IonIcon icon={arrowBack} slot='icon-only' />
            </IonButton>

            <IonTitle style={{ fontSize: 'var(--ui-font-size)' }}>搜尋藥品</IonTitle>

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
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonSearchbar ref={this.searchBarRef} placeholder='請輸入字詞，再按鍵盤Enter鍵' value={this.state.keyword}
            onIonClear={ev => {
              this.props.history.push(`/dictionary/search`);
            }}
            onKeyUp={(ev: any) => {
              const value = ev.target.value;
              this.setState({ keyword: value })
              if (value === '') {
                this.setState({ searches: [] });
              } else if (ev.key === 'Enter') {
                if (value === this.props.match.params.keyword) {
                  this.search(value, true);
                } else {
                  this.setState({ searches: [] });
                  this.props.history.push(`/dictionary/search/${value}`);
                }
              }
            }} />

          {this.props.loadingTwdData ?
            <IonLoading
              cssClass='uiFont'
              isOpen={this.props.loadingTwdData}
              message={'載入中...'}
            />
            :
            this.props.match.params.keyword == null || this.state.searches.length < 1 || (this.props.dictionaryHistory.length > 0 && (this.state.keyword === '' || this.state.keyword === undefined)) ?
              <>
                <div className='uiFont' style={{ color: 'var(--ion-color-primary)' }}>搜尋歷史</div>
                <IonList>
                  {this.props.dictionaryHistory.map((keyword, i) =>
                    <IonItem key={`dictHistoryItem_${i}`} button={true} onClick={async event => {
                      if (keyword === this.props.match.params.keyword) {
                        this.setState({ keyword });
                        this.search(keyword, true);
                      }
                      else {
                        this.props.history.push(`/dictionary/search/${keyword}`);
                        this.setState({ searches: [] });
                      }
                    }}>
                      <IonLabel className='ion-text-wrap uiFont' key={`dictHistoryLabel_` + i}>
                        {keyword}
                      </IonLabel>
                    </IonItem>
                  )}
                </IonList>
                <div style={{ textAlign: 'center' }}>
                  <IonButton fill='outline' shape='round' size='large' onClick={e => {
                    this.setState({ keyword: '' });
                    this.props.dispatch({
                      type: "SET_KEY_VAL",
                      key: 'dictionaryHistory',
                      val: [],
                    });
                  }}>清除歷史</IonButton>
                </div>
              </>
              :
              <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                <IonList>
                  {this.getRows()}
                  <IonInfiniteScroll threshold="100px"
                    disabled={!this.state.isScrollOn}
                    onIonInfinite={(ev: CustomEvent<void>) => {
                      this.search(this.props.match.params.keyword);
                      (ev.target as HTMLIonInfiniteScrollElement).complete();
                    }}>
                    <IonInfiniteScrollContent
                      loadingText="載入中...">
                    </IonInfiniteScrollContent>
                  </IonInfiniteScroll>
                </IonList>
              </div>
          }

          <IonAlert
            cssClass='uiFont'
            isOpen={this.state.showNoSelectedTextAlert}
            backdropDismiss={false}
            header='失敗'
            message='請確認是否已選擇一段文字，然後再執行所選的功能!'
            buttons={[
              {
                text: '確定',
                cssClass: 'primary uiFont',
                handler: (value) => {
                  this.setState({
                    showNoSelectedTextAlert: false,
                  });
                },
              }
            ]}
          />

          <IonLoading
            cssClass='uiFont'
            isOpen={this.state.isLoading}
            onDidDismiss={() => this.setState({ isLoading: false })}
            message={'載入中...'}
          />

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

const DictionaryPage = withIonLifeCycle(_DictionaryPage);

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    loadingTwdData: state.tmpSettings.loadingTwdData,
    dictionaryHistory: state.settings.dictionaryHistory,
  }
};

//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(DictionaryPage);
