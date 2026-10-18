@echo off
chcp 65001 >nul
title 新加坡迪士尼郵輪檢核表伺服器
cd /d "%~dp0"

echo ========================================================
echo  正在啟動「新加坡迪士尼郵輪檢核表」本地伺服器...
echo  修改、新增、刪除、打勾將自動存入 checklist.txt！
echo ========================================================
echo.

python server.py

if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 啟動失敗，請確認是否已安裝 Python。
    pause
)
