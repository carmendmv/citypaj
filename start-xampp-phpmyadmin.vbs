' Script VBScript para iniciar XAMPP y phpMyAdmin silenciosamente
Set WshShell = CreateObject("WScript.Shell")

' Iniciar XAMPP
WshShell.Run "C:\xampp\xampp_start.exe", 0, False

' Esperar 10 segundos
WScript.Sleep 10000

' Abrir phpMyAdmin en navegador
WshShell.Run "http://localhost/phpmyadmin/", 1, False

' Mostrar notificación
WshShell.Popup "XAMPP iniciado y phpMyAdmin abierto", 3, "Sistema Listo", 64
