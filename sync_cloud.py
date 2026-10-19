"""
新加坡迪士尼郵輪檢核表 - Google 試算表 / 雲端雙向同步腳本
【SSOT 防覆蓋安全版】：以 Google 試算表 (gid=1069250031) 為唯一真實資料來源，嚴格禁止本地端覆蓋雲端試算表！
"""

import urllib.request
import json
import sys
import io
import os
import csv

SPREADSHEET_ID = "1mSLZvnE1YW9qG23owDlmcZtr7EKZgVXuO4sBwIVaqzo"
GID = "1069250031"
WEB_APP_URL = "https://script.google.com/macros/s/AKfycbypiBAZI4Wzs8QpNP3aTSxFf3sPi6XlZQRY_t-lhIyvpeVbXONPhT-muAUX5-DkEX5rQw/exec"
CSV_EXPORT_URL = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv&gid={GID}"

def pull_from_google_sheet():
    """從 Google 試算表下載最新正確資料，並同步更新本地 google_sheet_current.csv 與 checklist.txt"""
    print(f"📥 正在從 Google 試算表 (gid={GID}) 拉取最新資料...")
    req = urllib.request.Request(CSV_EXPORT_URL, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        csv_text = resp.read().decode('utf-8')

    with open("google_sheet_current.csv", "w", encoding="utf-8") as f:
        f.write(csv_text)

    # 解析並更新 checklist.txt
    rows = list(csv.reader(csv_text.splitlines()))
    lines = []
    lines.append('================================================================================')
    lines.append('新加坡迪士尼郵輪 + 當地5日遊 10天行李與行前檢核表')
    lines.append('資料來源：Google 試算表（最新主版本 SSOT 同步）')
    lines.append('================================================================================')
    lines.append('【使用與自動同步說明】')
    lines.append('1. [狀態]：[v] 代表已完成，[ ] 代表待打包/未完成。')
    lines.append('2. [格式]：[狀態] 項目名稱 | 標籤分類')
    lines.append('   下一行縮排為「細節：」備註與注意事項。')
    lines.append('3. 此檔案已與 Google 試算表 (gid=1069250031) 100% 保持一致，絕不反向覆蓋試算表。')
    lines.append('================================================================================\n')

    cat_count = 0
    item_count = 0
    for r in rows:
        if not r or not any(r): continue
        colA = r[0].strip()
        colB = r[1].strip() if len(r)>1 else ''
        colC = r[2].strip() if len(r)>2 else ''
        colD = r[3].strip() if len(r)>3 else ''
        colE = r[4].strip() if len(r)>4 else ''

        if '行李實用檢核表' in colA or '行李檢核表' in colA or colA == '狀態 (勾選)' or '物品名稱' in colC:
            continue

        if colA.startswith('📂'):
            title = colA.replace('📂', '').strip()
            lines.append(f"\n[分類] {title}")
            cat_count += 1
            continue

        itemName = colC if colC else colB
        if not itemName:
            continue

        checked = ('✅' in colA or '已完成' in colA or '[v]' in colA.lower())
        mark = '[v]' if checked else '[ ]'
        tag = f" | {colD}" if colD else ''
        lines.append(f"{mark} {itemName}{tag}")
        if colE:
            lines.append(f"    細節：{colE}")
        item_count += 1

    with open("checklist.txt", "w", encoding="utf-8") as f:
        f.write('\n'.join(lines))

    print(f"✅ 成功同步！已自 Google 試算表讀取 {cat_count} 個分類、共 {item_count} 項物品，已寫入本地 checklist.txt 與 google_sheet_current.csv！")

def trigger_sheet_sync():
    """通知 Google Apps Script 重新自 Google 試算表讀取最新內容至雲端快取"""
    url = f"{WEB_APP_URL}?action=syncFromSheet"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get_remote_data():
    """從 Google 雲端取得目前 Web App 清單資料"""
    url = f"{WEB_APP_URL}?action=getData"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

if __name__ == '__main__':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    action = sys.argv[1] if len(sys.argv) > 1 else 'status'

    if action == 'pull':
        pull_from_google_sheet()
    elif action == 'sync':
        res = trigger_sheet_sync()
        print("雲端同步自試算表結果:", res)
    elif action == 'status':
        try:
            pull_from_google_sheet()
        except Exception as e:
            print("讀取試算表狀態:", e)
    elif action in ['init', 'push']:
        print("🛡️ 【防護警報】為保護您的 Google 試算表資料，禁止從本地端覆蓋試算表！")
        print("👉 Google 試算表是唯一事實來源 (SSOT)。所有修改請直接在試算表中進行，本地端僅執行 pull 下載。")
