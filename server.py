import os
import sys
import json
import webbrowser
import http.server
from urllib.parse import urlparse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
TXT_FILE = os.path.join(DIRECTORY, "checklist.txt")

class ChecklistHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and prevent caching
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "connected",
                "txtFile": "checklist.txt",
                "exists": os.path.exists(TXT_FILE)
            }).encode("utf-8"))
            return
        elif parsed.path == "/api/get_txt":
            if os.path.exists(TXT_FILE):
                with open(TXT_FILE, "r", encoding="utf-8") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
            else:
                self.send_response(404)
                self.end_headers()
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/save_txt":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            with open(TXT_FILE, "w", encoding="utf-8") as f:
                f.write(body)
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "msg": "已即時存入 checklist.txt"
            }).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

def run_server():
    server_address = ('', PORT)
    try:
        httpd = http.server.HTTPServer(server_address, ChecklistHTTPHandler)
    except OSError:
        # Port might be in use, try 8080
        alt_port = 8080
        httpd = http.server.HTTPServer(('', alt_port), ChecklistHTTPHandler)
        print(f"Port {PORT} 已被占用，切換至 http://localhost:{alt_port}")
        webbrowser.open(f"http://localhost:{alt_port}")
        httpd.serve_forever()
        return

    print("=" * 60)
    print(f"✨ 檢核表本地伺服器已成功啟動！")
    print(f"🌐 瀏覽器請造訪：http://localhost:{PORT}")
    print(f"💾 任何網頁修改/打勾將自動即時存檔至：{TXT_FILE}")
    print(f"提示：保持此視窗開啟即可自動同步，關閉時請按 Ctrl+C")
    print("=" * 60)

    # Automatically open the browser
    webbrowser.open(f"http://localhost:{PORT}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n伺服器已停止。")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
