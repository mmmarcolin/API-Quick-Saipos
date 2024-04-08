const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('api', {
    processCSV: (...args) => ipcRenderer.invoke('process-csv', ...args),
    executeConfigure: (...args) => ipcRenderer.invoke('execute-configure', ...args),
    toggleWindowSize: (isVisible) => ipcRenderer.send('toggle-window-size', !isVisible),
    openExternal: (url) => shell.openExternal(url),
    showAlert: (message) => ipcRenderer.send('show-alert', message),
    getMappings: () => ipcRenderer.invoke('get-mappings'),
})
