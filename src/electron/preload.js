const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    processCSV: (...args) => ipcRenderer.invoke('process-csv', ...args),
    executeConfigure: (...args) => ipcRenderer.invoke('execute-configure', ...args),
    toggleWindowSize: (isVisible) => ipcRenderer.send('toggle-window-size', !isVisible),
    showAlert: (message) => ipcRenderer.send('show-alert', message),
    openExternal: (url) => ipcRenderer.invoke('open-external-link', url),
    sendSaiposAuthToken: (token) => ipcRenderer.send('saipos-auth-token', token),
    onConfigurationResponse: (callback) => ipcRenderer.on('configuration-response', (event, message) => callback(message))
})