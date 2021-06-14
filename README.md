# 台灣藥品資訊(Taiwan Drug Info)

## <a id='feature'>特色</a>

搜尋藥品、全文檢索、書籤功能、網址分享、離線瀏覽、佈景主題切換、字型調整、app更新、跨平台、無廣告、開放原始碼。

## 說明

台灣藥品資訊 (Taiwan Drug Info)，簡寫twdi，使用台灣政府開放資料之《全部藥品許可證資料集》，支援以下功能

* <a id='search'>搜尋藥品</a>
* <a id='bookmark'>書籤</a>
* <a id='shareAppLink'>網址分享</a>
  1. 用瀏覽器開啟此app並開啟某藥品後，可複製其網址分享給別人開啟。
  2. 也可以使用瀏覽器內建書籤功能儲存藥品網址。與app書籤功能相比，可以依個人使習慣作選擇。
  3. App內建"分享此頁"功能，可複製藥品連結至作業系統剪貼簿或產生QR code，可分享給其他人。

* 離線瀏覽
* 佈景主題切換
* 字型調整
  1. 考量視力不佳的使用者，提供最大128 px的字型設定。若有需要更大字型，請E-mail或GitHub聯絡開發者新增。

* App更新

  此app不定期發佈更新，包含新功能或bug修正。注意!App檔案更新後，要關閉、重啟1次app或所有瀏覧器app分頁才會載入新版程式。目前支援2種更新方式:

  1. App啟動: app啟動後，會自動檢查一次有無新版。
  2. 手動: 至設定頁，按"PWA版本"文字。

* <a id='report'>App異常回報</a>

  App設定頁的異常回報鈕使用方法為：執行會造成app異常的步驟後，再至設定頁按下異常回報鈕，即會自動產生一封E-mail，包含異常的記錄，發送此E-mail給我們即可。

程式碼為開放(MIT License)，可自由下載修改、重新發佈。

## 支援平台
已在這些環境作過安裝、測試:
* Windows 10 +  Chrome
* Android 9 + Chrome
* macOS 11 + Chrome
* iPad 7 + Safari
* iPhone 8 + Safari
* Debian Linux 10 + Chrome

非上述環境仍可嘗試使用此app。若有<a href='#knownIssues'>已知問題</a>未描述的問題，可用<a href='#report'>異常回報</a>功能。

建議OS與Chrome、Safari保持在最新版，以取得最佳app體驗。

## <a id='install'>安裝</a>

此app目前有1種取得、安裝方式：

  1. Chrome、Safari網頁瀏覽器。

建議採用第1種用瀏覽器安裝，以取得最完整的app功能體驗。安裝方法如下。

### <a id='web-app'>從瀏覽器開啟/安裝</a>
請用Chrome (Windows, macOS, Linux, Android作業系統使用者)、Safari (iOS (iPhone, iPad)使用者)瀏覽器開啟以下網址：

https://MrRogerHuang.github.io

或：

<a href='https://MrRogerHuang.github.io' target='_blank'>
<img width="auto" height='60px' src='https://user-images.githubusercontent.com/9122190/28998409-c5bf7362-7a00-11e7-9b63-db56694522e7.png'/>
</a>

此progressive web app (PWA)，可不安裝直接在網頁瀏覽器執行，或安裝至手機、平板、筆電、桌機。建議安裝，以避免瀏覽器定期清除快取，導致書籤資料不見！

#### Windows, macOS, Linux, Android - 使用Chrome安裝
使用Chrome瀏覧器（建議最新版）開啟上述PWA網址後，網址列會出現一個加號，如圖所示：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/ChromeInstall.png' width='50%' />

點擊它，以完成安裝。安裝完後會在桌面出現"台灣藥品"app圖示。

#### iOS - 使用Safari安裝
1. 使用Safari開啟web app網址，再點擊下方中間的"分享"圖示：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Safari/OpenAppUrl.png' width='50%' />

2. 滑動頁面至下方，點選"加入主畫面"(Add to Home Screen)：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Safari/AddToHomeScreen.png' width='50%' />

3. App安裝完，出現在主畫面的圖示：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Safari/AppIcon.png' width='50%' />

## <a id='knownIssues'>已知問題</a>
1. iOS Safari 13.4以上才支援"分享此頁"功能。

## <a id='history'>版本歷史</a>
* 1.3.0:
  * 設定頁新增"App設定與書籤"及"更新離線藥品資料"。
  * 初始下載離線資料UI加入進度條。
  * 修正書籤頁變更順序功能異常。
* 1.0.2:
  * 修正搜尋頁搜尋結果不正確問題。
* 1.0.1:
  * 修正搜尋頁搜尋後凍結問題。
  * 修正搜尋頁搜尋結果不正確問題。
* 1.0.0:
  * 第1版。

## 隱私政策聲明

此app無收集使用者個人資訊，也無收集匿名資訊。

## 第三方軟體版權聲明

1. 全部藥品許可證資料集 ( https://data.gov.tw/dataset/9122 )

    此app使用《全部藥品許可證資料集》。此開放資料依政府資料開放授權條款 (Open Government Data License) 進行公眾釋出，使用者於遵守本條款各項規定之前提下，得利用之。政府資料開放授權條款：https://data.gov.tw/license