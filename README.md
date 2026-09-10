# Carrie Coaching Tracker

私人 Coaching 時數追蹤 PWA。

## 私隱設計
- Coaching 資料只儲存在使用者裝置的瀏覽器 `localStorage`。
- Repository 只存放 App 程式碼，不存放 Coachee 姓名、電話、Feedback 或反思。
- 首次開啟會要求設定 4–6 位本機 PIN；PIN 只以雜湊形式儲存在裝置。
- 頁面加入 `noindex`，並以 `robots.txt` 阻止搜尋引擎爬取。

## GitHub Pages
如帳戶方案支援 Private Repository 的 GitHub Pages：Settings → Pages → Deploy from a branch → `main` / `(root)` → Save。

網站預計地址：`https://carriehw.github.io/carrie-coaching-tracker/`
