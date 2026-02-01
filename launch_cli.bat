@echo off
echo Starting Hot Wheels Collection Manager CLI...
echo.
python hotwheels_manager.py
if errorlevel 1 (
    echo.
    echo Error: Failed to start application.
    echo Please make sure Python is installed and all dependencies are installed.
    echo Run: pip install -r requirements.txt
    echo.
    pause
)
