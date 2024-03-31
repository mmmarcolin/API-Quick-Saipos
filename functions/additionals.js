module.exports = async function additionals(page, additionalsData, storeId, pizzaBigger, pizzaProportional) {
  try {
    // Lista auxiliares de inclusão
    const pizzaDough = [
      'Massa', 'MASSA', 'massa', 
      'Massas', 'MASSAS', 'massas'
    ]

    const pizzaCrust = [
      'Borda', 'BORDA', 'borda',
      'Bordas', 'BORDAS', 'bordas'
    ]

    const pizzaFlavor = [
      'Sabor', 'SABOR', 'sabor',
      'Sabores', 'SABORES', 'sabores'
    ]

    const pizza = [
      'Pizza', 'PIZZA', 'pizza',
      'Pizzas', 'PIZZAS', 'pizzas'
    ]

    let k = 1
    let err = []     
    const start = new Date()

    // Cadastro de adicionais
    for (let i = 1; i < additionalsData.item.length; i++) {
      try {
        
        var splittedAdditional = additionalsData.additional[i].split(' ')
        const isFlavor = splittedAdditional.some(item => pizza.includes(item)) && splittedAdditional.some(item => pizzaFlavor.includes(item))
        const isCrust = splittedAdditional.some(item => pizza.includes(item)) && splittedAdditional.some(item => pizzaCrust.includes(item))
        const isDough = splittedAdditional.some(item => pizza.includes(item)) && splittedAdditional.some(item => pizzaDough.includes(item)) 
        const isOther = (isFlavor || isCrust || isDough) ? false : true

        //Acesso à página de adicionais
        await page.goto('https://conta.saipos.com/#/app/v2/cardapio/products/create/pizza?categories-products-list=%7B%22page%22:1,%22pageSize%22:25%7D', {timeout: 0})
        await timeOut(2000)

        await waitForAndClick(page, '#nav-choices-tab')
        await waitForAndClick(page, '#pizzaChoicesMenu')

        if (isFlavor) {
          await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(2) ')
        } else if (isCrust) {
          await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(3) ')
        } else if (isDough) {
          await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(4)')
        } else if (isOther) {
          await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(5)')
        }

        await waitForAndSelectAll(page,'#choice-name')
        await waitForAndType(page, '#choice-name', `${additionalsData.additional[i]}`)
        
        if (!isDough) {
          await waitForAndSelectAll(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(2) > input')
          await waitForAndType(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(2) > input', `${additionalsData.quantity[i][0]}`)
          await waitForAndSelectAll(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(3) > input')
          await waitForAndType(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(3) > input', `${additionalsData.quantity[i][1]}`)

          if (pizzaBigger && !isOther) {
            await waitForAndClick(page, '#nav-basic-data > div > div.d-flex.justify-content-between.mb-5 > div.d-flex.flex-fill.flex-column > div.me-4.mt-4.col-product-name.flex-fill > saipos-select > ng-select > div')
            await page.keyboard.press('ArrowDown') 
            await timeOut(200)
            await page.keyboard.press('Enter')      
            await timeOut(200)
          }
        }

        let j = i
        await waitForAndClick(page, '#nav-basic-data > div > div.card.choice-items > table > tbody > tr.ng-untouched.ng-pristine.ng-valid > td:nth-child(2) > input')
        await page.keyboard.type(additionalsData.item[j])
        await timeOut(500)
        await page.keyboard.press('Tab')      
        await timeOut(500)
        await page.keyboard.type(additionalsData.price[j])      
        await timeOut(500)
        await page.keyboard.press('Tab')      
        await timeOut(500)
        await page.keyboard.type(additionalsData.code[j])      
        await timeOut(500)
        await page.keyboard.press('Tab')      
        await timeOut(500)
        await page.keyboard.press('Tab')      
        await timeOut(500)
        j++

        while (additionalsData.additional[j] == additionalsData.additional[j-1]) {
          await page.keyboard.press('Enter')      
          await timeOut(500)
          await page.keyboard.type(additionalsData.item[j])
          await timeOut(500)
          await page.keyboard.press('Tab')      
          await timeOut(500)
          await page.keyboard.type(additionalsData.price[j])      
          await timeOut(500)
          await page.keyboard.press('Tab')      
          await timeOut(500)
          await page.keyboard.type(additionalsData.code[j])      
          await timeOut(500)
          await page.keyboard.press('Tab')      
          await timeOut(500)
          await page.keyboard.press('Tab')      
          await timeOut(500)
          await page.keyboard.press('Tab')      
          await timeOut(500)
          j++
        } 
        j--
        
        await waitForAndClick(page, '#nav-detail-data-tab')
        
        await waitForAndClick(page, '#choice-item-detail-delivery')
        await page.keyboard.type(additionalsData.description[i])
        await timeOut(500)
        i++
        
        while (additionalsData.additional[i] == additionalsData.additional[i-1]) {
          await page.keyboard.press('Tab')      
          await timeOut(500)
          await page.keyboard.press('Tab')      
          await timeOut(500)
          await page.keyboard.type(additionalsData.description[i])
          await timeOut(500)
          i++

          // Avisos de progresso
          let end = new Date()
          if (((end - start) / 60000 ) > (k*10)) {
            console.log(`PROGRESSO ADICIONAIS: ${storeId} | ${k*10} minutos | ${Math.round((i/additionalsData.item.length)*100)}%`)
            ipcRenderer.send('show-alert', `PROGRESSO ADICIONAIS: ${storeId} | ${k*10} minutos | ${Math.round((i/additionalsData.item.length)*100)}%`)    
            k++
          }
        }
        i--

        await page.keyboard.press('Tab')      
        await timeOut(500)
        await page.keyboard.press('Tab')      
        await timeOut(500)
        await page.keyboard.press('Enter') 
        await timeOut(500)

        await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > ul > li > div > div.choices-list-item-header > div.hstack.gap-3.pe-5.py-2 > button')
        
      } catch {
        err.push(additionalsData.additional[i])
        await page.goto('https://conta.saipos.com/#/', {timeout: 0})
      }
    }

    // Avisos de erros
    if (err.length > 0) {
      ipcRenderer.send('show-alert', `ADICIONAIS NÃO CADASTRADOS: ${storeId} | ${[...new Set(err)].map(item => ' ' + item)}`)
      console.log(`ADICIONAIS NÃO CADASTRADOS: ${storeId} | ${[...new Set(err)].map(item => ' ' + item)} `)
    }
    
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ADICIONAIS', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de ADICIONAIS, revise após a execução do programa.')
    return  ["ADICIONAIS: ",{ stack: error.stack }]
  }
}