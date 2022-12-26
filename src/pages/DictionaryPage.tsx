import React, { ReactNode } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonAlert, IonList, IonItem, IonLabel, IonLoading, IonToast, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonInput } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import Globals from '../Globals';
import { shareSocial, arrowBack, search } from 'ionicons/icons';
import { DictItem } from '../models/DictItem';
import { ChineseHerbItem } from '../models/ChineseHerbItem';

import './DictionaryPage.css';

interface Props {
  dispatch: Function;
  loadingTwdData: boolean;
  dictionaryHistory: Array<string>;
}

interface PageProps extends Props, RouteComponentProps<{
  path: string;
  tab: string;
  mode: string;
  keyword: string;
}> { }

interface State {
  keyword: string;
  searches: Array<DictItem | ChineseHerbItem>;
  showNoSelectedTextAlert: boolean;
  popover: any;
  isScrollOn: boolean;
  fetchError: boolean;
  showToast: boolean;
  toastMessage: string;
}

class _DictionaryPage extends React.Component<PageProps, State> {
  filteredData: Array<DictItem | ChineseHerbItem>;
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
      fetchError: false,
      showToast: false,
      toastMessage: '',
    }
    this.filteredData = [];
  }

  mode = '';
  ionViewWillEnter() {
    //console.log(`${this.props.match.url} will enter`);
    this.mode = this.props.match.params.mode;
    const keyword = this.props.match.params.keyword;
    this.setState({ keyword: keyword }, () => {
      this.search(true);
    });
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
  loadMoreLock = false;
  async search(newSearch: boolean = false) {
    await new Promise<void>((ok, fail) => {
      let timer = setInterval(() => {
        if (!this.props.loadingTwdData) {
          clearInterval(timer);
          ok();
        }
      }, 50);
    });

    if (this.props.match.params.keyword == null || this.props.match.params.keyword !== this.state.keyword) {
      return;
    }

    if (this.loadMoreLock) {
      return;
    }
    this.loadMoreLock = true;

    if (newSearch) {
      const re = new RegExp(`.*${this.props.match.params.keyword}.*`, 'i');
      if (this.mode !== 'searchCH') {
        this.filteredData = Globals.dictItems.filter((dictItem) =>
          dictItem.通關簽審文件編號 !== "null" && (re.test(dictItem.中文品名) || re.test(dictItem.英文品名) || re.test(dictItem.通關簽審文件編號) || re.test(dictItem.製造商名稱) || re.test(dictItem.主成分略述))
        );
      } else {
        this.filteredData = Globals.chineseHerbsItems.filter((dictItem) =>
          (re.test(dictItem.藥品名稱) || re.test(dictItem.處方成分) || re.test(dictItem.許可證字號) || re.test(dictItem.製造商名稱))
        );
      }
      this.page = 0;
    }

    console.log(`Loading page ${this.page}`);
    const newAppendSearchesRangeEnd = Math.min((this.page + 1) * this.rows, this.filteredData.length);
    const newAppendSearches = this.filteredData.slice(this.page * this.rows, newAppendSearchesRangeEnd);
    const newSearches = newSearch ? newAppendSearches : [...this.state.searches, ...newAppendSearches];

    this.setState({
      fetchError: false,
      searches: newSearches,
      isScrollOn: newSearches.length < this.filteredData.length,
    }, () => {
      this.page += 1;
      this.loadMoreLock = false;
    });

    if (newSearch) {
      this.props.dictionaryHistory.unshift(this.state.keyword);
      this.props.dictionaryHistory.splice(10);
      this.props.dispatch({
        type: "SET_KEY_VAL",
        key: 'dictionaryHistory',
        val: this.props.dictionaryHistory,
      });
    }
    return true;
  }

  clickToSearch() {
    if (this.state.keyword === this.props.match.params.keyword) {
      this.search(true);
    } else {
      this.props.history.push({
        pathname: `${Globals.pwaUrl}/dictionary/${this.mode}/${this.state.keyword}`,
      });
    }
  }

  getRows() {
    const data = this.state.searches;
    let rows = Array<ReactNode>();
    data.forEach((item: DictItem | ChineseHerbItem, index: number) => {
      const drugId = this.mode !== 'searchCH' ? (item as DictItem).通關簽審文件編號 : /[^\d]*(\d*)/.exec((item as ChineseHerbItem).許可證字號)![1];
      rows.push(
        <IonItem button={true} key={`dictItem` + index}
          onClick={async event => {
            event.preventDefault();
            this.props.history.push({
              pathname: `${Globals.pwaUrl}/dictionary/${this.mode === 'searchCH' ? 'chineseHerb' : 'drug'}/${drugId}`,
            });
          }}>
          <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
          <div className='listItem'>
            <div>
              <IonLabel className='ion-text-wrap uiFont' key={`bookmarkItemLabel_` + index}>
              {this.mode !== 'searchCH' ? (item as DictItem).中文品名 : (item as ChineseHerbItem).藥品名稱}
              </IonLabel>
            </div>
            <div>
              <IonLabel className='ion-text-wrap uiFontX0_7'>
                {item.製造商名稱}
              </IonLabel>
            </div>
          </div>
        </IonItem>
      );
    });
    return rows;
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton hidden={this.isTopPage} fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
              <IonIcon icon={arrowBack} slot='icon-only' />
            </IonButton>

            <IonTitle className='uiFont'>搜尋藥品</IonTitle>

            <IonButton fill='outline' shape='round' slot='start' onClick={ev => {
              this.props.history.push({
                pathname: `${Globals.pwaUrl}/dictionary/${this.mode === 'searchCH' ? 'search' : 'searchCH'}`,
              });
            }}>
              <span className='uiFont'>{this.mode !== 'searchCH' ? '西藥' : '中藥'}</span>
            </IonButton>

            <IonButton fill='clear' slot='end' onClick={e => {
              Globals.shareByLink(this.props.dispatch, decodeURIComponent(window.location.href));
            }}>
              <IonIcon icon={shareSocial} slot='icon-only' />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IonInput className='uiFont' placeholder='輸入後，按搜尋' value={this.state.keyword}
              clearInput={(this.state.keyword?.length || 0) > 0}
              onKeyUp={(ev: any) => {
                const value = ev.target.value;
                this.setState({ keyword: value }, () => {
                  if (ev.key === 'Enter') {
                    this.clickToSearch();
                  }
                });
              }}
              onIonChange={ev => {
                const value = `${ev.target.value || ''}`;
                this.setState({ keyword: value }, () => {
                  if (value === '') {
                    this.props.history.push({
                      pathname: `${Globals.pwaUrl}/dictionary/${this.mode}`,
                    });
                  }
                });
              }}
            />
            <IonButton fill='outline' size='large' onClick={() => {
              this.clickToSearch();
            }}>
              <IonIcon slot='icon-only' icon={search} />
            </IonButton>
          </div>

          {this.props.loadingTwdData ?
            <IonLoading
              cssClass='uiFont'
              isOpen={this.props.loadingTwdData}
              message={'載入中...'}
            />
            :
            this.props.match.params.keyword == null ?
              <>
                <div className='uiFont' style={{ color: 'var(--ion-color-primary)' }}>搜尋歷史</div>
                <IonList>
                  {this.props.dictionaryHistory.map((keyword, i) =>
                    <IonItem key={`dictHistoryItem_${i}`} button={true} onClick={async event => {
                      if (keyword === this.props.match.params.keyword) {
                        //                        this.setState({ keyword });
                        //                        this.search(true);
                      }
                      else {
                        this.props.history.push({
                          pathname: `${Globals.pwaUrl}/dictionary/${this.mode}/${keyword}`,
                        });
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
              this.state.searches.length < 1 ?
                <IonLabel className='uiFont'>
                  ❌ 找不到搜尋藥品
                </IonLabel>
                :
                <IonList>
                  {this.getRows()}
                  <IonInfiniteScroll threshold="100px"
                    disabled={!this.state.isScrollOn}
                    onIonInfinite={(ev: CustomEvent<void>) => {
                      this.search();
                      (ev.target as HTMLIonInfiniteScrollElement).complete();
                    }}>
                    <IonInfiniteScrollContent
                      loadingText="載入中...">
                    </IonInfiniteScrollContent>
                  </IonInfiniteScroll>
                </IonList>
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
    dictionaryHistory: JSON.parse(JSON.stringify(state.settings.dictionaryHistory)),
  };
};

//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(DictionaryPage);
