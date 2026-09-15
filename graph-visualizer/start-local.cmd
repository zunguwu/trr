@echo off
cd /d "%~dp0"
if exist "..\node.exe" if exist "..\package\bin\npm-cli.js" (
  set "PATH=%~dp0..;%PATH%"
  "..\node.exe" "..\package\bin\npm-cli.js" run dev
  exit /b
)
npm run dev
