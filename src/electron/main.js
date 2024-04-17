// Importações
const { app, BrowserWindow, dialog, ipcMain, Tray, Menu, shell } = require('electron')
const { processCSV } = require('../utils/csvHandle')
const { executeConfigure } = require('../services/executeConfigure')
const path = require('path')
const requestToSaipos = require('../services/requestsToSaipos')
const { normalizeText } = require('../utils/auxiliarVariables')
require('dotenv').config()

// Definição de variáveis
let win
let tray = null

// Criação de janela
function createWindow() {
    win = new BrowserWindow({
        icon: path.join(__dirname, '..', '..', 'public', 'assets', 'saiposlogo.png'),
        width: 940,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    win.loadFile(path.join(__dirname, '..', '..', 'public', 'index.html'))

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault()
            win.hide()
        }
        return false
    })
}

// Esconder na bandeja
function createTray() {
    const iconPath = path.join(__dirname, '..', '..', 'public', 'assets', 'saiposlogo.png')
    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Abrir', click: () => win.show() },
        { label: 'Sair', click: () => { app.isQuiting = true; app.quit() }}
    ])

    tray.setToolTip('Nome do seu aplicativo')
    tray.setContextMenu(contextMenu)

    tray.on('double-click', () => win.show())
}

// Ações de janela
app.whenReady().then(() => {
    createWindow()
    createTray()
})
app.on('activate', () => {
    if (!win) {
        createWindow()
    } else {
        win.show()
    }
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})



// Ações externas
ipcMain.on('toggle-window-size', (event, shouldExpand) => {
    const currentWin = BrowserWindow.getFocusedWindow() 
    if (currentWin) {
        const { width, height } = currentWin.getBounds()
        const minWidth = 340
        const minHeight = 450
        const maxWidth = 940
        const maxHeight = 900
        
        let newWidth, newHeight
    
        if (shouldExpand) {
            newWidth = Math.min(width + 1000, maxWidth)
            newHeight = Math.min(height + 1000, maxHeight)
        } else {
            newWidth = Math.max(width - 1000, minWidth)
            newHeight = Math.max(height - 1000, minHeight)
        }
    
        currentWin.setSize(newWidth, newHeight)
        currentWin.setMinimumSize(minWidth, minHeight)
        currentWin.setMaximumSize(maxWidth, maxHeight)
    }
})
ipcMain.on('show-alert', (event, alertMessage) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Aviso',
        message: alertMessage,
    })
})
ipcMain.handle('process-csv', async (event, ...args) => {
    return processCSV(...args)
})
ipcMain.handle('normalize-text', async (event, text) => {
    return normalizeText(text)
})
ipcMain.handle('execute-configure', async (event, ...args) => {
    return executeConfigure(...args)
})
ipcMain.handle('open-external-link', async (event, url) => {
    await shell.openExternal(url)
})
ipcMain.on('saipos-auth-token', (event, token) => {
    requestToSaipos.setToken(token)
})
ipcMain.handle('get-token', async (event) => {
    const token = process.env.HUBSPOT_AUTH_TOKEN
    if (!token) {
        throw new Error("Token is not defined in environment variables")
    }
    return token
})