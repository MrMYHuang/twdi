# 台灣藥品資訊 (Taiwan Drug Info)

## <a id='feature'>特色</a>

搜尋藥品、書籤功能、網址分享、離線瀏覽、佈景主題切換、字型調整、跨平台、無廣告、開放原始碼。

## 說明

台灣藥品資訊 (Taiwan Drug Info)，簡寫 twdi，使用台灣政府開放資料之《全部藥品許可證資料集》，支援以下功能

* <a id='search'>搜尋藥品</a>
  1. 西藥
  2. 中藥
* <a id='bookmark'>書籤</a>
* <a id='shareAppLink'>網址分享</a>
  1. 用瀏覽器開啟此app並開啟某藥品後，可複製其網址分享給別人開啟。
  2. 也可以使用瀏覽器內建書籤功能儲存藥品網址。與 app 書籤功能相比，可以依個人使習慣作選擇。
  3. App 內建"分享此頁"功能，可複製藥品連結至作業系統剪貼簿或產生 QR code，可分享給其他人。

* 離線瀏覽
* 佈景主題切換
* 字型調整
  1. 考量視力不佳的使用者，提供最大 128 px 的字型設定。若有需要更大字型，請 E-mail 或 GitHub 聯絡開發者新增。
* <a id='shortcuts'>App捷徑</a>
  1. Windows, Android 的 Chrome (建議最新版)使用者，滑鼠右鍵或長按app圖示，可存取 app 功能捷徑，目前有：搜尋西藥、搜尋中藥、(開啟)第1書籤。

  <img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/AppShortcuts.png' width='50%' />

* <a id='report'>App 異常回報</a>

  App 設定頁的異常回報鈕使用方法為：執行會造成 app 異常的步驟後，再至設定頁按下異常回報鈕，即會自動產生一封 E-mail，包含異常的記錄，發送此 E-mail 給我們即可。

程式碼為開放 (MIT License)，可自由下載修改、重新發佈。

## 支援平台
已在這些環境作過安裝、測試:
* Windows 10 +  Chrome
* Android 9 + Chrome
* macOS 11 + Chrome
* iPad 7 + Safari
* iPhone 8 + Safari
* Debian Linux 10 + Chrome

非上述環境仍可嘗試使用此 app。若有<a href='#knownIssues'>已知問題</a>未描述的問題，可用<a href='#report'>異常回報</a>功能。

建議 OS 與 Chrome、Safari 保持在最新版，以取得最佳 app 體驗。

## <a id='install'>安裝</a>

此 app 目前有2種取得、安裝方式：

  1. Chrome, Safari 網頁瀏覽器。
  2. App 商店。

### <a id='web-app'>從瀏覽器開啟/安裝</a>
請用 Chrome (Windows, macOS, Linux, Android作業系統使用者)、Safari (iOS (iPhone, iPad)使用者)瀏覽器開啟以下網址：

https://myhpwa.github.io/twdi

或：

<a href='https://myhpwa.github.io/twdi' target='_blank'>
<img width="auto" height='60px' src='https://user-images.githubusercontent.com/9122190/28998409-c5bf7362-7a00-11e7-9b63-db56694522e7.png'/>
</a>

此 progressive web app (PWA)，可不安裝直接在網頁瀏覽器執行，或安裝至手機、平板、筆電、桌機。建議安裝，以避免瀏覽器定期清除快取，導致書籤資料不見！

#### Windows, macOS, Linux, Android - 使用 Chrome 安裝
使用 Chrome 瀏覧器（建議最新版）開啟上述PWA網址後，網址列會出現一個加號，如圖所示：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/ChromeInstall.png' width='50%' />

點擊它，以完成安裝。安裝完後會在桌面出現"台灣藥品" app圖示。

#### iOS - 使用 Safari安裝
1. 使用 Safari 開啟 web app 網址，再點擊下方中間的"分享"圖示：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Safari/OpenAppUrl.png' width='50%' />

2. 滑動頁面至下方，點選"加入主畫面" (Add to Home Screen)：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Safari/AddToHomeScreen.png' width='50%' />

3. App 安裝完，出現在主畫面的圖示：

<img src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Safari/AppIcon.png' width='50%' />

### <a id='storeApp'>從 App 商店安裝</a>
#### Android - 使用 Google Play Store
<a href='https://play.google.com/store/apps/details?id=io.github.myhpwa.twdi' target='_blank'>
<img width="auto" height='60px' alt='Google Play 立即下載' src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/zh-tw_badge_web_generic.png'/>
</a>

#### iOS 14.0+ (iPhone), iPadOS 14.0+ (iPad) - 使用 App Store
<a href='https://apps.apple.com/app/id1576303166' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Download_on_the_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### macOS 10.10+ - 使用 App Store
<a href='https://apps.apple.com/app/id1576303166' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/Download_on_the_Mac_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### Windows 10 - 使用 Microsoft Store
<a href='https://www.microsoft.com/store/apps/9N0Z88W4ZC93' target='_blank'>
<img width="auto" height='60px' src='https://developer.microsoft.com/store/badges/images/Chinese-Traditional_get-it-from-MS.png' alt='Chinese Traditional badge'/>
</a>

#### Linux - 使用 Snap Store
<a href='https://snapcraft.io/twdi' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twdi/raw/main/docs/images/[TW]-snap-store-black@2x.png' />
</a>

## <a id='knownIssues'>已知問題</a>
1. iOS Safari 13.4 以上才支援"分享此頁"功能。

## <a id='history'>版本歷史</a>
* Snap apps 1.3.0:
  * [修正] Snap 版匯入／匯出存取權限問題.
  * [優化] 升級至 Electron 31.4.0。

* PWA 3.8.1:
  * [修正] Chrome 115 下拉選單顯示異常。

* PWA 3.8.0:
  * [新增] 藥品搜尋結果顯示製造商。

* PWA 3.7.0:
  * [新增] 搜尋頁新增搜尋鈕。
  * [優化] 搜尋頁找不到辭會顯示錯誤。
  * [新增] 初次啟動會提示將下載離線資料。

* PWA 3.5.5:
  * [修正] 手動更新離線藥品資料後，上次更新日期未更新的問題。

* PWA 3.5.4:
  * [修正] Chrome 瀏覽器開啟自動中翻英後，app 功能異常的 bug。

* PWA 3.5.3:
  * [修正] 在 iOS 有時無法更新的問題。

* PWA 3.5.2:
  * [修正] 分享 app 連結未複製到剪貼簿的問題。

* PWA 3.5.1:
  * [修正] 30天未更新離線藥品資料功能。

* PWA 3.5.0:
  * [新增] 設定頁顯示上次離線藥品更新時間。
  * [新增] 設定頁"啟用離線藥品更新通知"。

* PWA 3.3.0:
  * [優化] 更新套件。

* PWA 3.2.4:
  * [修正] 網址分享在新電腦開啟異常。
* PWA 3.2.2:
  * [修正] setState, dispatch 相關狀態更新 bugs。
* 3.2.0:
  * 錯誤回報功能作 E-mail 檢查。
  * 錯誤回報功能支援填寫問題發生步驟。
  * 遷移舊設定檔至新檔。
* Snap 1.1.0:
  * 支援 Linux arm64。
* MAS 1.1.0:
  * 支援 Universal app。
* 3.1.0:
  * 修正錯誤回報功能異常的問題。
* 3.0.8:
  * 修改搜尋英文名，不再分大小寫。
* 3.0.7:
  * 移除 store apps 不必要的 app 安裝連結。
  * 移除設定頁 app 更新通知功能，以符合 Mac App Store 上架規範。
* 3.0.5:
  * 修正分享功能在 iOS 異常的問題。
* 3.0.4:
  * 修正佈景主題切換後，所選項目文字沒出現的問題。
* 3.0.2:
  * 修正"更新離線藥品資料"進度顯示。
  * 修正中藥"單/複方"欄位值。
* 3.0.0:
  * 修改程式，使 app 能運作在非根目錄下。
  * 新版 PWA 網址：https://myhpwa.github.io/twdi
  * 舊版網址將不再維護！
* 2.0.0:
  * 支援中藥。
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

此 app 無收集使用者個人資訊，也無收集匿名資訊。

## 第三方軟體版權聲明

1. 全部藥品許可證資料集 ( https://data.gov.tw/dataset/9122 )

    此app使用《全部藥品許可證資料集》。此開放資料依政府資料開放授權條款 (Open Government Data License) 進行公眾釋出，使用者於遵守本條款各項規定之前提下，得利用之。政府資料開放授權條款：https://data.gov.tw/license
