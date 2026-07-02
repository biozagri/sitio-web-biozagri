@echo off
chcp 65001 > nul 2>&1
cd /d "%~dp0"

echo.
echo   BIOZAGRI -- Eliminar articulo del blog
echo   ========================================
echo.
echo   Cargando lista de articulos...
echo.

node tools\eliminar-articulo.js --list

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo   Error al leer el archivo de datos.
  echo.
  pause
  exit /b 1
)

echo.
set /p NUMERO=  Escribe el NUMERO del articulo a eliminar (Enter para cancelar):

if "%NUMERO%"=="" (
  echo.
  echo   Cancelado. No se elimino ningun articulo.
  echo.
  pause
  exit /b 0
)

echo.
echo   Eliminando articulo numero %NUMERO%...
echo.

node tools\eliminar-articulo.js --delete %NUMERO%

echo.
pause
