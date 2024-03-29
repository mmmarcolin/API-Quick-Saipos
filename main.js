const { app, BrowserWindow, dialog, ipcMain, screen, Tray, Menu } = require('electron') // Módulo para importar Electron
const path = require('path')

let win // Variável global para manter a referência da janela
let tray = null // Variável global para manter a referência da bandeja

// Função para criar uma nova janela do Electron
function createWindow() {
    // Definições de resolução
    const mainScreen = screen.getPrimaryDisplay() // Obter informações sobre o monitor principal
    const dimensions = mainScreen.size // Obter a resolução do monitor principal

    // Configurações da janela
    win = new BrowserWindow({
        width: 890, // Definir a largura da janela
        height: dimensions.height, // Definir a altura da janela como a altura do monitor
        icon: path.join(__dirname, 'resources', 'saiposLogo.png'), // Ícone Saipos
        webPreferences: {
            nodeIntegration: true, // Permite a integração com o Node.js
            contextIsolation: false, // Desabilita o isolamento de contexto
            enableRemoteModule: true, // Habilita o módulo remoto
        }
    })

    // Carrega o arquivo HTML na janela
    win.loadFile('index.html')

    // Ouvinte para o evento de redimensionamento
    ipcMain.on('toggle-window-size', (event, shouldExpand) => {
        const currentWin = BrowserWindow.getFocusedWindow() // Obtém a janela atualmente focada
        if (currentWin) {
            const { width, height } = currentWin.getBounds()
            if (shouldExpand) {
                currentWin.setSize(width, height + 615)
            } else {
                currentWin.setSize(width, Math.max(410, height - 615)) // Evita que a janela fique muito pequena
            }
        }
    })

    // Evento disparado ao fechar a janela
    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault() // Previne o fechamento padrão
            win.hide() // Esconde a janela em vez de fechar
        }

        return false
    })
}

// Função para criar e configurar a bandeja do sistema
function createTray() {
    const iconPath = path.join(__dirname, 'resources', 'saiposLogo.png') // Caminho para o ícone da bandeja
    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Abrir', click: () => win.show() },
        { label: 'Sair', click: () => { app.isQuiting = true; app.quit() }}
    ])

    tray.setToolTip('Nome do seu aplicativo') // Tooltip para o ícone da bandeja
    tray.setContextMenu(contextMenu) // Configura o menu da bandeja

    // Evento para mostrar a janela ao clicar duas vezes no ícone da bandeja
    tray.on('double-click', () => win.show())
}

// Aguarda o aplicativo estar pronto antes de criar a janela e a bandeja
app.whenReady().then(() => {
    createWindow()
    createTray()
})

// Fecha o aplicativo quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Cria uma nova janela quando o aplicativo é ativado e não há nenhuma janela aberta
app.on('activate', () => {
    if (!win) {
        createWindow()
    } else {
        win.show()
    }
})

// Ouve o evento 'show-alert' para exibir uma caixa de diálogo de alerta
ipcMain.on('show-alert', (event, alertMessage) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Alerta',
        message: alertMessage,
        buttons: ['OK']
    })
})

// Ouve o evento 'get-documents-path' para obter o caminho da pasta de documentos do usuário
ipcMain.on('get-documents-path', (event) => {
    const documentsPath = app.getPath('documents')
    event.sender.send('documents-path', documentsPath)
})
