const { waitForAndType, waitForAndClick, timeOut } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function waiters(page, waiters, waitersDailyRate) {
  try {

    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/waiters', {timeout: 0})

    // Cadastra um garçom por vez
    for (let i = 0; i < waiters; i++) {
      await timeOut(2000)
      await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
      await waitForAndType(page, '#input-descricao', `Garçom ${i+1}`)
      await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > form > div > div:nth-child(2) > div.col-sm-4 > div > div > input', `${waitersDailyRate[i]*100}`)
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
    }

    // Tempo para salvar
    await timeOut(3000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de GARÇONS', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de GARÇONS, revise após a execução do programa.')
    return  ["GARÇONS: ",{ stack: error.stack }]
  }
}