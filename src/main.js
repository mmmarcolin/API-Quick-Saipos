const { app, BrowserWindow, dialog, ipcMain, Tray, Menu } = require('electron')
const path = require('path')
const { choicesMappings, menuMappings, deliveryAreasMappings, processCSV } = require('./utils/csvHandle')
const executeConfigure = require('./services/executeConfigure')

let win
let tray = null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(__dirname, '..', 'public', 'assets', 'saiposlogo.png'),
        width: 940,
        height: 820,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    win.loadFile(path.join(__dirname, '..', 'public', 'index.html'))

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault()
            win.hide()
        }
        return false
    })
}

function createTray() {
    const iconPath = path.join(__dirname, '..', 'public', 'assets', 'saiposlogo.png')
    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Abrir', click: () => win.show() },
        { label: 'Sair', click: () => { app.isQuiting = true; app.quit() }}
    ])

    tray.setToolTip('Nome do seu aplicativo')
    tray.setContextMenu(contextMenu)

    tray.on('double-click', () => win.show())
}

app.whenReady().then(() => {
    createWindow()
    createTray()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (!win) {
        createWindow()
    } else {
        win.show()
    }
})

ipcMain.on('show-alert', (event, alertMessage) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Alerta',
        message: alertMessage,
        buttons: ['OK']
    })
})

ipcMain.on('toggle-window-size', (event, shouldExpand) => {
    const currentWin = BrowserWindow.getFocusedWindow() 
    if (currentWin) {
        const { width, height } = currentWin.getBounds()
        const minWidth = 340
        const minHeight = 410
        const maxWidth = 940
        const maxHeight = 840
    
        let newWidth, newHeight
    
        if (shouldExpand) {
            newWidth = Math.min(width + 600, maxWidth)
            newHeight = Math.min(height + 410, maxHeight)
        } else {
            newWidth = Math.max(width - 600, minWidth)
            newHeight = Math.max(height - 410, minHeight)
        }
    
        currentWin.setSize(newWidth, newHeight)
        currentWin.setMinimumSize(minWidth, minHeight)
        currentWin.setMaximumSize(maxWidth, maxHeight)
    }
})

ipcMain.handle('process-csv', async (event, ...args) => {
    return processCSV(...args)
})

ipcMain.handle('execute-configure', async (event, ...args) => {
    return executeConfigure(...args)
})
