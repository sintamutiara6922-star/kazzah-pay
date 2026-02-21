@echo off
echo ========================================
echo   Checking Redis Connection
echo ========================================
echo.

cd /d "%~dp0"
node scripts\check-redis.js

echo.
pause
