const { waitForAndType, waitForAndClick, timeOut } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function tableOrder(page, tables) {
  try {

    //Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/table-order', {timeout: 0})

    // Se forem mais de 100, quebra em partes de no máximo 100 unidades e repete
    const batchSize = 100
    let totalTables = tables
    const batches = Math.ceil(totalTables / batchSize)

    // Cadastro de comandas para cada parte criada
    for (let i = 0; i < batches; i++) {
      let tablesInBatch = Math.min(batchSize, totalTables)
      await timeOut(1000)
      await waitForAndType(page, '#content > data > div > form > div > div:nth-child(1) > table > tbody > tr > td > div > div.col-xs-2.m-r-0.p-r-0 > div > input', `${parseInt(tablesInBatch)}`)
      await waitForAndClick(page, '#content > data > div > form > div > div:nth-child(1) > table > tbody > tr > td > div > div.col-xs-4.m-l-0 > div > button.btn.btn-primary.m-b-0.create.waves-effect')
      
      // Determina o tempo de espera baseado no número de batch
      if (tablesInBatch > 50) {
        await timeOut(9000)
      } else {
        await timeOut(6000)
      }
      totalTables -= tablesInBatch
    }

    // Tempo para salvar
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de MESAS, revise após a execução do programa.')
    return  ["COMANDAS: ",{ stack: error.stack }]
  }
}

