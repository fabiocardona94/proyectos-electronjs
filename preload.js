const { contextBridge, ipcRenderer } = require('electron');

//métodos específicos en el contexto aislado
contextBridge.exposeInMainWorld('electron', {
  // Método para solicitar la información del sistema
  getSystemInfo: () => ipcRenderer.invoke('getSystemInfo'),
  // Método para recibir la información del sistema desde el proceso principal
  onSystemInfo: (callback) => ipcRenderer.on('systemInfo', (event, data) => callback(data))
});
