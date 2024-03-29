const { waitForAndClick, timeOut } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function taxesData(page) {
  try {

    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/taxes-data', {timeout: 0})

    // Acesso aos dados fiscais
    await timeOut(1000)
    await waitForAndClick(page, '#content > data > div > base-crud > div > div > base-crud-data-table > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.text-center > button.btn.btn-default.ng-scope.waves-effect')
    await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > form > div > div.row.p-t-20 > div > div > ul > li:nth-child(3)')
    await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > form > div > div.row.p-t-20 > div > div > div > div.tab-pane.ng-scope.active > div > div > div:nth-child(1) > div.col-sm-10 > div > div > div > div')
    await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > form > div > div.row.p-t-20 > div > div > div > div.tab-pane.ng-scope.active > div > div > div:nth-child(1) > div.col-sm-10 > div > div > div > div > div > ul > li:nth-child(1)')
    await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.ng-scope > div > button.btn.btn-primary.m-b-0.waves-effect')
    
    // Tempo para salvar
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  // Tratamento de erros 
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CEST', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de CEST, revise após a execução do programa.')
    return  ["CEST: ",{ stack: error.stack }]
  }
}