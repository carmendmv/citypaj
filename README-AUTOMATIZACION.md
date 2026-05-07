# 🚀 Automatización XAMPP + phpMyAdmin

## 📋 RESUMEN DEL PROYECTO COMPLETADO

### ✅ BASE DE DATOS CITYPAJ
- **780 anuncios únicos** importados exitosamente
- **52 provincias españolas** con 15 anuncios cada una
- **Títulos específicos por región** - cero repeticiones
- **Sintaxis SQL perfecta** - validada y funcional

---

## 🛠️ OPCIONES DE AUTOMATIZACIÓN

### Opción 1: Script BATCH (.bat)
**Archivo:** `start-xampp-phpmyadmin.bat`

```batch
@echo off
echo Iniciando XAMPP y phpMyAdmin automaticamente...

cd "C:\xampp"
call xampp_start.exe

timeout /t 10 /nobreak >nul

start http://localhost/phpmyadmin/

echo XAMPP iniciado y phpMyAdmin abierto en tu navegador
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
```

**Uso:**
- Doble clic en el archivo `.bat`
- Inicia XAMPP y abre phpMyAdmin automáticamente

---

### Opción 2: Script VBScript (.vbs) - Silencioso
**Archivo:** `start-xampp-phpmyadmin.vbs`

```vbscript
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "C:\xampp\xampp_start.exe", 0, False
WScript.Sleep 10000
WshShell.Run "http://localhost/phpmyadmin/", 1, False
WshShell.Popup "XAMPP iniciado y phpMyAdmin abierto", 3, "Sistema Listo", 64
```

**Uso:**
- Doble clic en el archivo `.vbs`
- Inicia XAMPP en segundo plano
- Abre phpMyAdmin silenciosamente

---

## 🎯 CONFIGURACIÓN ADICIONAL

### Para inicio automático con Windows:
1. **Copiar script** a: `C:\Users\%USERNAME%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`
2. **O crear acceso directo** y moverlo a la carpeta de inicio

### Para acceso rápido:
1. **Crear acceso directo** en el Escritorio
2. **Asignar teclas rápidas** (Ctrl+Alt+X)

---

## 📁 ARCHIVOS CREADOS
- `start-xampp-phpmyadmin.bat` - Script interactivo
- `start-xampp-phpmyadmin.vbs` - Script silencioso
- `README-AUTOMATIZACION.md` - Esta documentación

---

## ✅ VERIFICACIÓN
Después de ejecutar el script:
1. XAMPP debe iniciar (Apache + MySQL)
2. phpMyAdmin debe abrirse en: `http://localhost/phpmyadmin/`
3. Base de datos `citypaj` con 780 anuncios disponible

---

**🎉 ¡Proyecto completado y automatizado!**
