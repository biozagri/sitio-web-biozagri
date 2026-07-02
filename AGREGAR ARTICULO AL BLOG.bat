@echo off
chcp 65001 > nul 2>&1
cd /d "%~dp0"

echo.
echo   BIOZAGRI -- Agregar articulo al blog
echo   ======================================
echo.

node tools\agregar-articulo.js

echo.
pause
