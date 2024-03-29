const { waitForAndType, waitForAndClick, timeOut } = require("./auxiliarFunctions") // Importação das funções auxiliares
const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

module.exports = async function settings(page, cancelPassword, cancelReason, col42) {
  try {

    // Acesso à página Impressão
    await page.goto('https://conta.saipos.com/#/app/store/settings/group-setting/', {timeout: 0})
    
    // Removendo anúncio
    await page.keyboard.press('Escape')
    await timeOut(50)
    await page.keyboard.press('Escape')
    
    // Cadastro Impressão caixa
      if (col42) {
        await timeOut(2000)
        await waitForAndClick(page, '#content > data > div > div > div > div.card-header.x-col-sm-5 > div > ul > li:nth-child(1) > a')
        await waitForAndClick(page, '#tabs-views > div > div.card-body.card-padding.card-store-setting-tab > div:nth-child(5) > div.col-sm-6 > div > div > input')
        await page.keyboard.press('Backspace')
        await page.keyboard.press('Backspace')
        await waitForAndType(page, '#tabs-views > div > div.card-body.card-padding.card-store-setting-tab > div:nth-child(5) > div.col-sm-6 > div > div > input', '42')
        await waitForAndClick(page, '#tabs-views > div > div.card-header > button')
        await timeOut(2000)
      }

    // Configurações extras
    if (cancelPassword || cancelReason) {

    //Acesso à página Vendas  
      await page.goto('https://conta.saipos.com/#/app/store/settings/group-setting/', {timeout: 0})

    //Cadastro Vendas todos os tipos
      await timeOut(2000)
      await waitForAndClick(page, '#content > data > div > div > div > div.card-header.x-col-sm-5 > div > ul > li:nth-child(8) > a')
      await timeOut(2000)

      // Ativa senha para cancelamento
      if (cancelPassword) {
        await waitForAndClick(page, '#tabs-views > div > div.card-body.card-padding.card-store-setting-tab > div:nth-child(1) > div.col-sm-6 > div > div > div > div')
        await waitForAndClick(page, '#tabs-views > div > div.card-body.card-padding.card-store-setting-tab > div:nth-child(1) > div.col-sm-6 > div > div > div > div > div > ul > li:nth-child(2')
      }

      // Ativa motivo para cancelamento
      if (cancelReason) {
        await waitForAndClick(page, '#tabs-views > div > div.card-body.card-padding.card-store-setting-tab > div:nth-child(3) > div.col-sm-6 > div > div > div > div')
        await waitForAndClick(page, '#tabs-views > div > div.card-body.card-padding.card-store-setting-tab > div:nth-child(3) > div.col-sm-6 > div > div > div > div > div > ul > li:nth-child(2)')
      }

      // Salva
      await timeOut(1000)
      await waitForAndClick(page, '#tabs-views > div > div.card-header > button')
      await timeOut(3000)
    }

    // Tempo de espera
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CONFIGURAÇÕES', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de CONFIGURAÇÕES, revise após a execução do programa.')
    return  ["CONFIGURAÇÕES: ",{ stack: error.stack }]
  }
}

