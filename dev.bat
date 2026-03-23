@echo off
echo Stopping existing dev servers...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting dev server...
cd /d "%~dp0"
npx next dev --turbopack
