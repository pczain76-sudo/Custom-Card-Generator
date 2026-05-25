const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    printCard: () => ipcRenderer.invoke('print-card')
});