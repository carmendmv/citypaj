@echo off
echo Iniciando XAMPP y phpMyAdmin automaticamente...

REM Iniciar Apache y MySQL desde XAMPP
cd "C:\xampp"
call xampp_start.exe

REM Esperar a que los servicios inicien
timeout /t 10 /nobreak >nul

REM Abrir phpMyAdmin en el navegador predeterminado
start http://localhost/phpmyadmin/

echo XAMPP iniciado y phpMyAdmin abierto en tu navegador
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
