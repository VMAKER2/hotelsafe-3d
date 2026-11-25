@echo off
cd /d "%~dp0"
echo Starting HotelSafe 3D Local Server at http://localhost:8095 ...
start http://localhost:8095
python -m http.server 8095
