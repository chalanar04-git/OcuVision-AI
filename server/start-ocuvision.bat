@echo off
title OcuVision AI - Startup

echo Starting OcuVision AI Backend...
start "OcuVision Backend" cmd /k "cd /d C:\Users\Chalana R\OneDrive\Desktop\OcuVision-AI\server && npm run dev"

echo Starting OcuVision AI Model Service...
start "OcuVision FastAPI" cmd /k "cd /d D:\OcuVision_AI && call C:\Users\Chalana R\OneDrive\Desktop\OcuVision-AI\model-env\Scripts\activate.bat && uvicorn model.main:app --reload --port 8000"

echo Starting OcuVision AI Frontend...
start "OcuVision Frontend" cmd /k "cd /d C:\Users\Chalana R\OneDrive\Desktop\OcuVision-AI\client && npm run dev"

echo.
echo OcuVision AI services are starting...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo FastAPI:  http://127.0.0.1:8000

timeout /t 5 >nul
start http://localhost:5173/