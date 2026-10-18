# Travel-Calendar ✈️🚢

> 新加坡迪士尼郵輪 + 當地 5 日遊（10 天行李與行前檢核表 & 每日行程日曆）

本專案提供互動式的旅遊行前準備清單與每日詳細行程表，支援離線操作、分類管理與雲端狀態同步。

---

## ✨ 核心特色

1. **行程日曆（Travel Calendar）**
   - 完整 10 天日程（含新加坡當地觀光與迪士尼冒險號 Disney Adventure 郵輪航程）。
   - 提供按日導航、每日重要時段行程提醒、地點資訊與注意事項。

2. **行李與行前檢核表（Packing & Pre-trip Checklist）**
   - 依重要證件、迪士尼郵輪必備、個人衣物、3C 與日常用品分類。
   - 支援勾選進度追蹤、分頁切換與搜尋篩選。

3. **雲端同步與在地服務**
   - 搭配 Google Apps Script 與 Google 試算表達成雲端多人即時協作與備份。
   - 提供 Python 本地伺服器（`server.py`）與批次檔一鍵啟動。

---

## 🚀 快速開始

### 方式一：直接在瀏覽器開啟
直接雙擊開啟專案目錄中的 `index.html` 即可瀏覽清單與行程表。

### 方式二：本地伺服器執行
雙擊執行 `一鍵啟動.bat` 或在終端機執行：
```bash
python server.py
```
隨後在瀏覽器訪問 `http://localhost:8000`。

---

## 📁 專案結構

```text
├── index.html              # 互動式前端介面（清單與行事曆整合）
├── calender/               # 每日行程文字檔資料 (1021-1030)
├── google_apps_script/     # Google Apps Script 雲端同步程式碼 (Code.gs)
├── IMG/                    # 專案圖片與素材
├── server.py               # 本地 HTTP 服務器
├── sync_cloud.py           # 雲端同步輔助腳本
├── checklist.txt           # 清單原始資料文字檔
└── README.md               # 專案說明文件
```

---

## 📄 License
MIT License
