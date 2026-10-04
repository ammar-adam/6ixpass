@echo off
rem The 6 Pass app mock: double-click this file to start it.
title The 6 Pass app mock
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed yet.
  echo Opening nodejs.org: download the LTS version, install it, then double-click run-app.bat again.
  start "" "https://nodejs.org/"
  pause
  exit /b 1
)

if not exist "node_modules\next" (
  echo.
  echo First run: installing what the app needs. This takes a few minutes, once.
  call npm install
  if errorlevel 1 (
    echo.
    echo Install failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo.
echo Starting The 6 Pass app mock. Your browser will open when it is ready.
echo Keep this window open while you use the app. Close it to stop.
set OPEN_BROWSER=1
call npm run app
pause
