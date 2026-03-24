@echo off
cd /d "%~dp0"
npx dotenv-cli -e .env.local -- npx tsx scripts/seed-content.ts
pause
