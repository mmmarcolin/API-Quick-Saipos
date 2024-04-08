const { app, BrowserWindow, dialog, ipcMain, Tray, Menu } = require('electron')
const path = require('path')

let win
let tray = null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(__dirname, 'public', 'assets', 'saiposlogo.png'),
        width: 940,
        height: 820,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.loadFile('public/index.html')
    win.maximize()

    ipcMain.on('toggle-window-size', (event, shouldExpand) => {
        const currentWin = BrowserWindow.getFocusedWindow() 
        if (currentWin) {
            const { width, height } = currentWin.getBounds()
            if (shouldExpand) {
                currentWin.setSize(width, height + 615)
            } else {
                currentWin.setSize(width, Math.max(410, height - 615)) 
            }
        }
    })

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault()
            win.hide()
        }
        return false
    })
}

function createTray() {
    const iconPath = path.join(__dirname, 'resources', 'saiposLogo.png')
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

ipcMain.on('get-documents-path', (event) => {
    const documentsPath = app.getPath('documents')
    event.sender.send('documents-path', documentsPath)
})
