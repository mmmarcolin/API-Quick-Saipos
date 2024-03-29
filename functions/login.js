const { waitForAndType, waitForAndClick, timeOut } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function login(page, saiposEmail, saiposPassword, storeId) {
  try {

    // Acesso à página
    await page.goto('https://conta.saipos.com', {timeout: 0})

    // Acesso ao sistema
    await timeOut(1000)
    await waitForAndType(page, '#l-login > form > div:nth-child(1) > div > input', saiposEmail)
    await waitForAndType(page, '#l-login > form > div:nth-child(2) > div > input', saiposPassword)
    await waitForAndClick(page, '#l-login > form > button')

    // Acesso à loja
    await timeOut(1000)
    await waitForAndClick(page, 'body > div.clientweb-scope > div.sweet-alert.showSweetAlert.visible > p:nth-child(8) > button.confirm.btn.btn-lg.btn-warning')
    await timeOut(5000)
    await waitForAndType(page, '#input-id', storeId)
    await timeOut(100)
    await waitForAndClick(page, '#filteredarray_0')

    // Removendo anúncio
    await page.keyboard.press('Escape')
    await timeOut(50)
    await page.keyboard.press('Escape')

    // Tempo para salvar
    await page.waitForNavigation()
    await timeOut(2000)

    // Removendo anúncio
    await page.keyboard.press('Escape')
    await timeOut(50)
    await page.keyboard.press('Escape')
    
  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o LOGIN', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de LOGIN, revise após a execução do programa.')
    return  ["LOGIN: ",{ stack: error.stack }]
  }
}