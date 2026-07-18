@echo off
title Historical Chatbot Launcher

echo ==========================================
echo       HISTORICAL CHATBOT LAUNCHER
echo ==========================================
echo.
echo Dang khoi dong cac dich vu...
echo.

:: Khoi dong Backend (mo cua so moi)
echo [1/2] Khoi dong Backend (FastAPI)...
start "Historical Chatbot - Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && python -m uvicorn main:app --reload --port 8000"

:: Khoi dong Frontend (mo cua so moi)
echo [2/2] Khoi dong Frontend (React/Vite)...
start "Historical Chatbot - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo Da gui lenh khoi dong!
echo - Backend dang chay o cong 8000 (Cua so den)
echo - Frontend dang chay o cong 5173 (Cua so den)
echo.
echo Bam phim bat ky de dong cua so Launcher nay 
echo (Cac server van se chay doc lap trong cac cua so moi).
echo ==========================================
pause >nul
