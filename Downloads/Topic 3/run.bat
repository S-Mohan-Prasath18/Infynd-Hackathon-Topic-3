@echo off
echo ==========================================
echo      Data QA Copilot - Startup Script
echo ==========================================
echo.
echo [1/2] Installing Dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies. Please check your internet connection.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Starting Data QA Copilot...
echo.
echo Open http://localhost:5000 in your browser.
echo Press Ctrl+C to stop the server.
echo.
set LLAMA_API_BASE=http://localhost:11434/v1
set LLAMA_API_KEY=ollama
echo.
echo [1.5] Checking Ollama Model...
ollama list | findstr "llama3.2:1b" >nul
if %errorlevel% neq 0 (
    echo Model llama3.2:1b not found. Pulling...
    ollama pull llama3.2:1b
)
echo API Key configured (Local).
python app.py
pause
