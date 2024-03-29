const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron


module.exports = async function partners(page, deliverySite, storeName, minimumValue, startTime, weekDays, endTime, waiterInstruction, counterInstruction, premiumMenu, basicMenu, cardFlags, pix, counterPickUp) {

  // Funções para lidar pagamentos
  async function processPayment(page, saiposOptionIndex, siteOptionIndex) {
    await waitForAndClick(page, '#paymentTypeSelect > div > a')
    await waitForAndClick(page, `#paymentTypeSelect > div > div > ul > li:nth-child(${saiposOptionIndex})`)
    if (!deliverySite) {
      await waitForAndClick(page, `#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.payment-types > div:nth-child(1) > div:nth-child(2) > div > div > div > div.col-md-5.text-left.m-l-30 > div > div > a`)
      await waitForAndClick(page, `#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.payment-types > div:nth-child(1) > div:nth-child(2) > div > div > div > div.col-md-5.text-left.m-l-30 > div > div > div > ul > li:nth-child(${siteOptionIndex})`)
      await waitForAndClick(page, `#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.payment-types > div:nth-child(1) > div:nth-child(2) > div > div > div > div.col-md-1.text-left > div > button`)
    } else {
      await waitForAndClick(page, '#content > data > div > div > div > store-integration-site > div > div > div > div > div.payment-types > div:nth-child(1) > div:nth-child(2) > div > div > div > div.col-md-5.text-left.m-l-30 > div > div > a')
      await waitForAndClick(page, `#content > data > div > div > div > store-integration-site > div > div > div > div > div.payment-types > div:nth-child(1) > div:nth-child(2) > div > div > div > div.col-md-5.text-left.m-l-30 > div > div > div > ul > li:nth-child(${siteOptionIndex})`)
      await waitForAndClick(page, '#content > data > div > div > div > store-integration-site > div > div > div > div > div.payment-types > div:nth-child(1) > div:nth-child(2) > div > div > div > div.col-md-1.text-left > div > button')
    }
  }
  
  // Fução para lidar horários de atendimento
  async function processTime() {
    await waitForAndClick(page, '#content > data > div > div > div > div > h2') 
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await timeOut(300)
    for (let i = 1; i <= 7; i++) {
      if (weekDays[i-1] == true) {
        await waitForAndClick(page, '#selectdayweek')
        switch (i+1) {
        case 2:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        case 3:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        case 4:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        case 5:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        case 6:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        case 7:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        case 8:
          await page.keyboard.press('D')
          await timeOut(100)
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
          await page.keyboard.press('Enter')
          await timeOut(100)
          break;
        default:
          break;
        }
        await page.keyboard.press('Tab')
        await page.keyboard.type(`${startTime}`)
        await page.keyboard.press('Tab')
        await page.keyboard.type(`${endTime}`)
        await page.keyboard.press('Tab')
        await page.keyboard.press('Enter')
        await timeOut(200)
        // await page.keyboard.down('Shift')
        // await page.keyboard.press('Tab')
        // await page.keyboard.press('Tab')
        // await page.keyboard.press('Tab')
        // await page.keyboard.up('Shift')
        // await page.keyboard.press('Enter')
      }
    }
  }

  // Lista de pagamentos aceitos
  const paymentOptions = []
  if (cardFlags && pix) {
    paymentOptions.push(
      { index: 2, optionIndex: 7 },
      { index: 3, optionIndex: 17 },
      { index: 4, optionIndex: 22 },
      { index: 5, optionIndex: 25 },
      { index: 7, optionIndex: 29 },
      { index: 8, optionIndex: 30 },
      { index: 9, optionIndex: 32 },
      { index: 10, optionIndex: 35 },
      { index: 15, optionIndex: 42 }
    )
  } else if (pix) {
    paymentOptions.push(
      { index: 1, optionIndex: 5 },
      { index: 2, optionIndex: 26 },
      { index: 3, optionIndex: 35 },
      { index: 8, optionIndex: 42 }
    )
  } else {
    paymentOptions.push(
      { index: 1, optionIndex: 5 },
      { index: 2, optionIndex: 26 },
      { index: 3, optionIndex: 35 }
    )
  }

  try {

    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/partners', {timeout: 0})

    // Habilitar canais de venda
    await timeOut(1000)
    if (basicMenu || premiumMenu) {
      await waitForAndClick(page, '#content > data > div > form > div > div > div > div.tab-pane.ng-scope.active > div > div > div > div.table-responsive.partner-sales-channels > table > tbody > tr:nth-child(12) > td:nth-child(2) > div > label > input')
    }
    if (deliverySite) {
      await waitForAndClick(page, '#content > data > div > form > div > div > div > div.tab-pane.ng-scope.active > div > div > div > div.table-responsive.partner-sales-channels > table > tbody > tr:nth-child(53) > td:nth-child(2) > div > label > input')    
    }
    await waitForAndClick(page, '#content > data > div > form > div > div > div > div.tab-pane.ng-scope.active > div > div > div > div.text-left > button')
    await timeOut(10000)

    // Site Delivery

    // Acesso à página de configurações do site delivery
    if (deliverySite) {
      await waitForAndClick(page, '#content > data > div > form > div > div > div > div.tab-pane.ng-scope.active > div > div > div > div.table-responsive.partner-sales-channels > table > tbody > tr:nth-child(53) > td:nth-child(3) > button')
      await timeOut(2000)
      
      // URL
      await waitForAndClick(page, '#content > data > div > div > div > store-integration-site > div > div.container > div > div > div.col-sm-6.p-l-0 > div.col-md-3.m-t-20.p-0 > div > button:nth-child(1)')
      for (let i = 17; i <= 20; i++) {
        try {
          await waitForAndClick(page, `body > div:nth-child(${i}) > div > div > div.modal-footer.ng-scope > button`)
          break
        } catch {}  
      }
      await waitForAndSelectAll(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(2) > div > div > div > div > div > input')
      await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div:nth-child(2) > div > div > div > div > div > input', `${storeName}.saipos.com`)
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-footer.p-t-10 > button.btn.btn-primary.m-b-0.waves-effect')
      
      // Demais configurações
      await timeOut(500)
      await waitForAndSelectAll(page, '#content > data > div > div > div > store-integration-site > div > div > div > div > div.col-sm-6.p-l-0 > div:nth-child(4) > div > div > div > input')
      await waitForAndType(page, '#content > data > div > div > div > store-integration-site > div > div > div > div > div.col-sm-6.p-l-0 > div:nth-child(4) > div > div > div > input', "#000000")
      if (counterPickUp) {
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-site > div > div.container > div > div > div.col-sm-6.p-l-0 > div:nth-child(6) > div:nth-child(1) > div.col-md-6.text-left.p-b-5 > div > label > input')
      }
      await waitForAndClick(page, '#content > data > div > div > div > store-integration-site > div > div.container > div > div > div.col-sm-6.p-l-0 > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div > fieldset > div:nth-child(3) > label > input')
      await waitForAndType(page, '#minimum-value', `${minimumValue * 100}`)

      // Horário de atendimento
      if (weekDays.includes(true)) {
        await processTime()
        await timeOut(2000)
      }
      
      // Formas de pagamento
      await waitForAndClick(page, '#content > data > div > div > div > div > h2') 
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await timeOut(300)
      for (const { index, optionIndex } of paymentOptions) {
        await processPayment(page, index, optionIndex);
      }
      await waitForAndClick(page, '#content > data > div > div > div > store-integration-site > div > div > div > div > div.row.p-l-15.div-buttons-forms > button.btn.btn-primary.waves-effect.btn-radius')
      
      // Tempo para salvar
      await timeOut(2000)
      await page.goto('https://conta.saipos.com/#/app/store/partners', {timeout: 0})
      await timeOut(2000)
    }
      
    // Cardápio digital

    // Acesso à página de cardápio digital
    if (basicMenu || premiumMenu) {
      await waitForAndClick(page, '#content > data > div > form > div > div > div > div.tab-pane.ng-scope.active > div > div > div > div.table-responsive.partner-sales-channels > table > tbody > tr:nth-child(12) > td:nth-child(3) > button')
      await timeOut(2000)

      // Importação site delivery
      if (deliverySite) {
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div > div > div > button')
        await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div > form > div.modal-body > div > div > div.col-sm-12.select-info-options > div > div > div > input', `${storeName}`)
        await page.keyboard.press('Enter')
        await timeOut(500)
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div > form > div.modal-body > div > div > div.table-options > table > tbody > tr:nth-child(1) > td.text-center > div > label > input')
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div > form > div.modal-body > div > div > div.table-options > table > tbody > tr:nth-child(2) > td.text-center > div > label > input')
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div > form > div.modal-body > div > div > div.table-options > table > tbody > tr:nth-child(3) > td.text-center > div > label > input')
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div > form > div.modal-body > div > div > div.table-options > table > tbody > tr:nth-child(4) > td.text-center > div > label > input')
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div > form > div.modal-footer > button.btn.btn-primary.m-b-0.waves-effect')        
      }
      
      
      if (!deliverySite) {

        // Cadastra URL 
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div > div > div > div.col-sm-6.p-l-0 > div.col-md-3.m-t-20.p-0 > div > button:nth-child(1)')
        await waitForAndSelectAll(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div > div > div > div > div > div > input')
        await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-body.p-l-5.p-r-5.p-b-0 > div > div > div > div > div > div > div > input', `${storeName}.saipos.com`)
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > form > div.modal-footer.p-t-10 > button.btn.btn-primary.m-b-0.waves-effect')

        // Ajusta Cor
        await waitForAndSelectAll(page, '#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.col-sm-6.p-l-0 > div.col-md-4 > div > div > div > input')  
        await waitForAndType(page, '#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.col-sm-6.p-l-0 > div.col-md-4 > div > div > div > input', "#000000")
      }

      
      // Instruções pagamento
      if (counterInstruction) {
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.col-sm-6.p-l-0 > div.submenu-side-delivery > div > ul > li:nth-child(4)')
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div > div > div > div.col-sm-6.p-l-0 > div.submenu-side-delivery > div > ul > li.ng-scope.ng-isolate-scope.active')
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div > div > div > div.col-sm-6.p-l-0 > div:nth-child(8) > store-table-payment-instruction > div > div > div > div > table > tbody > tr:nth-child(1) > td.x-col-md-1.text-center > div > label > input')
      } else if (waiterInstruction) {
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.col-sm-6.p-l-0 > div.submenu-side-delivery > div > ul > li:nth-child(4)')
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div > div > div > div.col-sm-6.p-l-0 > div.submenu-side-delivery > div > ul > li.ng-scope.ng-isolate-scope.active')
        await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.col-sm-6.p-l-0 > div:nth-child(8) > store-table-payment-instruction > div > div > div > div > table > tbody > tr:nth-child(2) > td.x-col-md-1.text-center > div > label > input')
      }

      // Formas pagamento
      if (!deliverySite && premiumMenu) {
        await waitForAndClick(page, '#content > data > div > div > div > div > h2') 
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Enter')
        await timeOut(1000)

        // Chamada da função de pagamentos
        for (const { index, optionIndex } of paymentOptions) {
          await processPayment(page, index, optionIndex)
        }
      }

      // Horários de atendimento
      if (weekDays.includes(true) && !deliverySite) {
        await processTime()
        await timeOut(1000)
      }

      // Cardápio Premium
      await waitForAndClick(page, '#content > data > div > div > div > div > h2') 
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await timeOut(1000)
      if (premiumMenu) {
        await waitForAndClick(page, '#enabled_online_order')
      }

      // Salva configurações
      await waitForAndClick(page, '#content > data > div > div > div > store-integration-table > div > div.container > div > div > div.row.p-l-15 > button.btn.btn-primary.waves-effect')
    }
    
    // Tempo para salvar
    await timeOut(1000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)  

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CANAIS DE VENDA', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de CANAIS DE VENDA, revise após a execução do programa.')
    return  ["CANAIS DE VENDA: ",{ stack: error.stack }]
  }
}