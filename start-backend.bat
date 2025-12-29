@echo off
echo ========================================
echo Visitor & Parcel Management System
echo Backend Server Startup
echo ========================================
echo.

cd backend

echo Checking dependencies...
call npm install
echo.

echo Starting backend server...
echo Backend will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
