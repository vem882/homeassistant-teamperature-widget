const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openConfigWindow: () => ipcRenderer.send('open-config-window'),
    moveWindow: (pos) => ipcRenderer.sendSync('move-window', pos)
})