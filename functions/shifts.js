const { waitForAndClick, waitForAndType, timeOut, waitForAndKeys, waitForAndSelectAll } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function users(page, serviceFee, shiftTime, shiftDesc) {

  try {

    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/shift', {timeout: 0})

    // Edita o primeiro turno
    await timeOut(1000)
    await waitForAndClick(page, '#content > data > div > form > div > div.table-responsive > table > tbody > tr > td.col-md-2 > button:nth-child(1)')

    // Executa o número de turnos cadastrado
    for (let i = 0; i < shiftDesc.length; i++) {
      
      // Cadastro do turno
      await waitForAndSelectAll(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div > div:nth-child(1) > div > div > div > input')
      await waitForAndKeys(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div > div:nth-child(1) > div > div > div > input', `${shiftDesc[i]}`)
      await waitForAndSelectAll(page, '#inputStartingTime')
      await waitForAndKeys(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div > div:nth-child(1) > div > div > div > input', `${shiftTime[i]}`)
      
      // Se taxa de serviço existir, ativa e inclui
      if (serviceFee[i] > 0) {
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div > div:nth-child(3) > div:nth-child(1) > div > div > div > label > input')
        await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div > div:nth-child(3) > div:nth-child(2) > div > div > input', `${serviceFee[i] * 100}`)
      }
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')

      if (shiftDesc.length > 1 && i != shiftDesc.length - 1) {
        await timeOut(1000)
        await waitForAndClick(page, '#content > data > div > form > div > div.lv-header-alt.clearfix.m-b-5 > button')
      } 
    }

    // Tempo para salvar
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)  

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de TURNOS', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de TURNOS, revise após a execução do programa.')
    return  ["TURNOS: ",{ stack: error.stack }]
  }
}