const { app, BrowserWindow, ipcMain } = require('electron');
const os = require('os');
const path = require('path');

// Función para crear la ventana principal
function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true, // Pantalla completa
    autoHideMenuBar: true, // Ocultar la barra de menú
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Usar preload script para seguridad
      contextIsolation: true, // Aislamiento de contexto para evitar riesgos de seguridad
      webSecurity: false, // Deshabilitar la seguridad web (solo para pruebas)
      webviewTag: true // Habilitar la etiqueta webview
    }
  });

  // Cargar el archivo index.html en la ventana
  win.loadFile(path.join(__dirname, 'index.html'));

  // Enviar información del sistema al renderizador cuando se haya cargado el contenido
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('systemInfo', getSystemInfo());
  });
}

// Función para obtener información del sistema
function getSystemInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    nodeVersion: process.version
  };
}

// Crear la ventana principal cuando la aplicación esté lista
app.whenReady().then(createWindow);

// Salir de la aplicación cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Volver a crear la ventana principal en macOS si no hay ventanas abiertas
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Manejar la solicitud de información del sistema desde el renderizador
ipcMain.handle('getSystemInfo', async () => {
  return getSystemInfo();
});
