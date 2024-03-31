const { waitForAndType, waitForAndClick, timeOut, waitForAndKeys, waitForAndSelectAll } = require("./auxiliarFunctions") // Importação das funções auxiliares
module.exports = async function neighborhoods(page, neighborhoodsData, storeCity, storeState, storeId ) {
  try { 

    // Acesso à página de cadastro de novos bairros
    await page.goto('https://conta.saipos.com/#/app/taxes-data/districts', {timeout: 0})

    //Cadastro de novos bairros
    await timeOut(2000) 
    await waitForAndClick(page, '#content > data > div > div > div.container > form > div > div:nth-child(1) > div > a')
    await waitForAndKeys(page, '#content > data > div > div > div.container > form > div > div:nth-child(1) > div > div > div', `${storeState}`)
    await page.keyboard.press('Enter')
    await timeOut(100) 
    await waitForAndClick(page, '#content > data > div > div > div.container > form > div > div:nth-child(2) > div > a')
    await waitForAndKeys(page, '#content > data > div > div > div.container > form > div > div:nth-child(2) > div > a', `${storeCity} `)
    await page.keyboard.press('Enter')
    await timeOut(1000) 
    await waitForAndClick(page, '#content > data > div > div > div.lv-header-alt.clearfix.m-b-5 > button')
    await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body > div > div > div > div > div > textarea')

    // Nova linha para cada bairro
    for (let i = 1; i < neighborhoodsData.neighborhood.length; i++) {
      await waitForAndType(page ,'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body > div > div > div > div > div > textarea', `${neighborhoodsData.neighborhood[i]  }`)
      await page.keyboard.press('Enter')
      await timeOut(100) 
    }
    await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-footer > button.btn.btn-primary.m-b-0.waves-effect')

    //Acesso à página de cadastro de áreas de entrega
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/app/store/delivery-area', {timeout: 0})   

    // Cadastro de áreas de entrega
    await timeOut(2000) 
      await page.waitForSelector('#content > data > div > div:nth-child(1) > div > h2 > button')
      await page.focus('#content > data > div > div:nth-child(1) > div > h2 > button')
      await waitForAndType(page, '#state_input_chosen > div > div > input', `${storeState}`)
      await page.keyboard.press('Enter')
      await timeOut(100) 
    
    // Repete para cada bairro
    await timeOut(1000) 
    await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > button.btn.btn-sm.btn-icon-text.waves-effect.m-r-10.btn-primary')
    const start = new Date()
    let k = 1
    let err = []
    for (let i = 1; i < neighborhoodsData.neighborhood.length; i++) {
      try {
        
        try {
          await timeOut(1000) 
          await waitForAndType(page, '#cityUp_chosen > div > div > input', `${storeCity}`)
          await page.keyboard.press('Enter') 
          await timeOut(200) 
          await waitForAndType(page, '#district_chosen > div > div > input', `${neighborhoodsData.neighborhood[i]  }`)
          await page.keyboard.press('Enter')
          await timeOut(200) 
          await waitForAndType(page, '#delivery-fee', `${neighborhoodsData.fee[i]}`)
          await waitForAndSelectAll(page, '#delivery-amount')
          await waitForAndType(page, '#delivery-amount', `${neighborhoodsData.fee[i]}`)
          await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > div.row.z-depth-1.m-l-0.m-r-0.m-t-10.p-20.ng-scope > div:nth-child(7) > button')
          await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > button.btn.btn-sm.btn-icon-text.waves-effect.m-r-10.btn-primary')
        } catch {
          try {
            await waitForAndType(page, '#district_chosen > div > div > input', `${neighborhoodsData.neighborhood[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '')  }`)
            await page.keyboard.press('Enter')
            await timeOut(100) 
            await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > div.row.z-depth-1.m-l-0.m-r-0.m-t-10.p-20.ng-scope > div:nth-child(7) > button')
            await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > button.btn.btn-sm.btn-icon-text.waves-effect.m-r-10.btn-primary')
          } catch {
            await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > div.row.z-depth-1.m-l-0.m-r-0.m-t-10.p-20.ng-scope > div:nth-child(8) > button')
            await timeOut(500) 
            await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > button.btn.btn-sm.btn-icon-text.waves-effect.m-r-10.btn-primary')
            err.push(neighborhoodsData.neighborhood[i])
          }
        }
        
        // Avisos de progresso
        let end = new Date()
        if (((end - start) / 60000 ) > (k*5)) {
          console.log(`PROGRESSO BAIRROS: ${storeId} | ${k*5} minutos | ${Math.round((i/neighborhoodsData.neighborhood.length)*100)}%`)
          ipcRenderer.send('show-alert', `PROGRESSO BAIRROS: ${storeId} | ${k*5} minutos | ${Math.round((i/neighborhoodsData.neighborhood.length)*100)}%`)
          k++
        }

      } catch {
        err.push(neighborhoodsData.neighborhood[i])

        //Acesso à página de cadastro de áreas de entrega
        await timeOut(2000)
        await page.goto('https://conta.saipos.com/#/', {timeout: 0})
        await timeOut(2000)
        await page.goto('https://conta.saipos.com/#/app/store/delivery-area', {timeout: 0})   

        // Cadastro de áreas de entrega
        await timeOut(2000) 
        await page.waitForSelector('#content > data > div > div:nth-child(1) > div > h2 > button')
        await page.focus('#content > data > div > div:nth-child(1) > div > h2 > button')
        await waitForAndType(page, '#state_input_chosen > div > div > input', `${storeState}`)
        await page.keyboard.press('Enter')
        await timeOut(100) 
      
        // Repete para cada bairro
        await timeOut(1000) 
        await waitForAndClick(page, '#content > data > div > div.card.print-margin-top-30 > form > div.card-header > button.btn.btn-sm.btn-icon-text.waves-effect.m-r-10.btn-primary')
      }
    }

    // Avisos de erros
    if (err.length > 0) {
      ipcRenderer.send('show-alert', `BAIRROS NÃO CADASTRADOS: ${storeId} | ${[...new Set(err)].map(item => ' ' + item)} `)
      console.log(`BAIRROS NÃO CADASTRADOS: ${storeId} | ${[...new Set(err)].map(item => ' ' + item)} `)
    }

    // Tempo para salvar
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de BAIRROS', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de BAIRROS, revise após a execução do programa.')
    return  ["BAIRROS: ",{ stack: error.stack }]
  }
}