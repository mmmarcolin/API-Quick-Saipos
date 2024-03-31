module.exports = async function deliveryMen(page, deliveryMen, deliveryMenDailyRate, easyDelivery) {
  try {
    
    // Acesso à página
    await page.goto('https://conta.saipos.com/#/app/store/delivery-man', {timeout: 0})

    // Removendo anúncio
    await page.keyboard.press('Escape')
    await timeOut(50)
    await page.keyboard.press('Escape')

    // Loop para cadastro de todos entregadores
    for (let i = 0; i < deliveryMen; i++) {
      await timeOut(2000)
      await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
      await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.group-field > div.col-xs-4.p-l-0 > div > input', `Entregador ${i+1}`)
      await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.group-field > div:nth-child(2) > div > input', `${deliveryMenDailyRate[i]*100}`)
      
      // Se for único e sem Entrega Fácil, é o padrão
      if (deliveryMen == 1 && !easyDelivery) {
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.row > div > div:nth-child(2) > div > div > label > input')
      }
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.modal-footer > button.btn.btn-primary.m-b-0.waves-effect')
    }
    
    // Se tiver Delivery Fácil, marca o serviço de entrega respectivo
    if (easyDelivery) {
      await timeOut(2000)
      await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
      await waitForAndType(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.group-field > div.col-xs-4.p-l-0 > div > input', `Entrega Fácil`)
      
      // Se não tiver outros entregadores, marca como padrão
      if (deliveryMen == 0) {
        await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.row > div > div:nth-child(2) > div > div > label > input')
      }
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.row > div > div:nth-child(1) > div > div > label > input')
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.row.bgm-light-gray.ng-scope > div > div > div > div > div')
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.card-body.card-padding > div > div.row.bgm-light-gray.ng-scope > div > div > div > div > div > div > ul > li:nth-child(3)')
      await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.ng-scope > div.modal-footer > button.btn.btn-primary.m-b-0.waves-effect')
    }
    
    // Tempo para salvar
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)  

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ENTREGADORES', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de ENTREGADORES, revise após a execução do programa.')
    return  ["ENTREGADORES: ",{ stack: error.stack }]
  }
}