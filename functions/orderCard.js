const { waitForAndType, waitForAndClick, timeOut } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function orderCard(page, orderCards) {
  try {

    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/order-card', {timeout: 0})

    // Se forem mais de 100, quebra em partes de no máximo 100 unidades e repete
    const batchSize = 100
    let totalOrderCards = orderCards
    const batches = Math.ceil(totalOrderCards / batchSize)

    // Cadastro de comandas para cada parte criada
    for (let i = 0; i < batches; i++) {
      let orderCardsInBatch = Math.min(batchSize, totalOrderCards)
      await timeOut(1000)
      await waitForAndType(page, '#content > data > div > form > div > div:nth-child(1) > table > tbody > tr > td > div > div.col-xs-2.m-r-0.p-r-0 > div > input', `${parseInt(orderCardsInBatch)}`)
      await waitForAndClick(page, '#content > data > div > form > div:nth-child(2) > div:nth-child(1) > table > tbody > tr > td > div > div:nth-child(2) > div > button')

      // Determina o tempo de espera baseado no número de batch
      if (orderCardsInBatch > 50) {
        await timeOut(9000)
      } else {
        await timeOut(6000)
      }      
      totalOrderCards -= orderCardsInBatch
    }

    // Tempo para salvar
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de COMANDA', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de COMANDA, revise após a execução do programa.')
    return  ["COMANDAS: ",{ stack: error.stack }]
  }
}

