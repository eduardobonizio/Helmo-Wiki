@echo off
cd /d "%~dp0"
set BROWSER=none
set PORT=3000
set HOST=0.0.0.0
call npm.cmd start
