"""
新加坡迪士尼郵輪檢核表 - Google 試算表 / 雲端雙向同步腳本
用於 AI 助理或本機全自動向 Google Apps Script Web App 推送或讀取更新。
"""

import urllib.request
import json
import sys
import io

WEB_APP_URL = "https://script.google.com/macros/s/AKfycbypiBAZI4Wzs8QpNP3aTSxFf3sPi6XlZQRY_t-lhIyvpeVbXONPhT-muAUX5-DkEX5rQw/exec"

def get_remote_data():
    """從 Google 雲端取得目前清單資料"""
    url = f"{WEB_APP_URL}?action=getData"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def trigger_sheet_sync():
    """通知 Google 試算表重新解析並同步至雲端快取"""
    url = f"{WEB_APP_URL}?action=syncFromSheet"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def trigger_sheet_init():
    """重設並以完整 120 項清單覆蓋 Google 試算表"""
    url = f"{WEB_APP_URL}?action=init"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def push_data_to_cloud(sections_data):
    """將本地結構化清單推送到雲端並更新試算表"""
    json_bytes = json.dumps(sections_data, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(
        WEB_APP_URL,
        data=json_bytes,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

if __name__ == '__main__':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    action = sys.argv[1] if len(sys.argv) > 1 else 'status'
    
    if action == 'sync':
        res = trigger_sheet_sync()
        print("同步結果:", res)
    elif action == 'init':
        res = trigger_sheet_init()
        print("初始化結果:", res)
    elif action == 'status':
        data = get_remote_data()
        total = sum(len(s.get('items', [])) for s in data)
        print(f"✅ 連線正常！雲端目前共有 {len(data)} 大分類、{total} 項物品。")
