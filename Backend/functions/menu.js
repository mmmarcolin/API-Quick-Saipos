module.exports = async function menu(saiposAuthToken, menuData, storeId ) {
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

    const drinks = [
      'Refrigerantes', 'Refrigerante', 'Sucos', 'Suco', 'Bebidas',
      'Bebida', 'Cervejas', 'Cerveja', 'Drinks', 'Coquetéis',
      'Água', 'Águas', 'Doses', 'Longneck', 'Longnecks',
      'Long neck', 'Long necks', 'Aguas', 'Agua', 'Coqueteis',
      'refrigerantes', 'refrigerante', 'sucos', 'suco', 'bebidas',
      'bebida', 'cervejas', 'cerveja', 'drinks', 'coquetéis',
      'água', 'águas', 'doses', 'longneck', 'longnecks',
      'long neck', 'long necks', 'aguas', 'agua', 'coqueteis',
      'REFRIGERANTES', 'REFRIGERANTE', 'SUCOS', 'SUCO', 'BEBIDAS',
      'BEBIDA', 'CERVEJAS', 'CERVEJA', 'DRINKS', 'COQUETÉIS',
      'ÁGUA', 'ÁGUAS', 'DOSES', 'LONGNECK', 'LONGNECKS',
      'LONG NECK', 'LONG NECKS', 'AGUAS', 'AGUA', 'COQUETEIS'
    ]
    
    const combo = [
      'Combo', 'COMBO', 'combo',
      'Combos', 'COMBOS', 'combos'
    ]

    const pizza = [
      'Pizza', 'PIZZA', 'pizza',
      'Pizzas', 'PIZZAS', 'pizzas'
    ]

    const foldedPizza = [
      'Dobrada', 'DOBRADA', 'dobrada',
      'Dobradas', 'DOBRADAS', 'dobradas'
    ]
    
    // Acesso à página de categorias
    const uniqueCategories = [...new Set(menuData.category)]
    
    let errCat = []
    for (let i = 1; i < uniqueCategories.length; i++) {
      try {

        // Cadastro de categorias
        await timeOut(2000)
        await page.goto('https://conta.saipos.com/#/app/v2/cardapio/categories/(0//modal:create)?categories-products-list=%7B%22page%22:1,%22pageSize%22:25%7D', {timeout: 0})
        await timeOut(2000)
        await waitForAndType(page, '#nav-basic-data > div.my-3 > input', `${uniqueCategories[i]}  `)
        await timeOut(200)
        await page.keyboard.press('Tab') 
        await timeOut(200)
        await page.keyboard.press('Enter')
        await timeOut(200)
        
        // Se a categoria estiver na variável drinks, cadastrar impressão como copa, senão, comida
        let splittedUniqueCategory = uniqueCategories[i].split(' ')
        if (splittedUniqueCategory.some(item => drinks.includes(item))) {
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
        }
        
        await page.keyboard.press('Enter')
        await timeOut(200)
        await page.keyboard.press('Tab') 
        await timeOut(200)
        await page.keyboard.press('Enter')
        await timeOut(200)
        
        // Se a categoria estiver na variável drinks, cadastrar imposto bebida, senão, comida
        if (!(splittedUniqueCategory.some(item => drinks.includes(item)))) {
          await page.keyboard.press('ArrowDown')
          await timeOut(100)
        }
        
        await timeOut(100)
        await page.keyboard.press('Enter')
        await timeOut(100)
        await page.keyboard.press('Tab') 
        await timeOut(100)
        await page.keyboard.press('Tab') 
        await timeOut(100)
        await page.keyboard.press('Enter')
        await timeOut(1000)
        await page.goto('https://conta.saipos.com/#/', {timeout: 0})
      } catch {
        await page.goto('https://conta.saipos.com/#/app/v2/cardapio/categories/(0//modal:create)?categories-products-list=%7B%22page%22:1,%22pageSize%22:25%7D', {timeout: 0})
        errCat.push(uniqueCategories[i])
      }
    }

    // Avisos de erros
    if (errCat.length > 0) {
      ipcRenderer.send('show-alert', `CATEGORIAS NÃO CADASTRADAS: ${storeId} | ${errCat} `)
      console.log(`CATEGORIAS NÃO CADASTRADAS: ${storeId} | ${errCat} `)
    }
    
    // Cadastro de produtos
    const start = new Date()
    let errProd = []
    let k = 1
    for (let i = 1; i < menuData.product.length; i++) {
    
      var splittedProduct = menuData.product[i].split(' ')
      const isPizza = splittedProduct.some(item => pizza.includes(item)) && !splittedProduct.some(item => foldedPizza.includes(item))
      const isCombo = isPizza && (splittedProduct.some(item => combo.includes(item)) || splittedProduct.includes("+"))
      const isOther = (isPizza || isCombo) ? false : true

      try {
        if (isPizza) {
          await timeOut(2000)
          await page.goto('https://conta.saipos.com/#/app/v2/cardapio/products/create/pizza?categories-products-list=%7B%22page%22:1,%22pageSize%22:25%7D', {timeout: 0})
          await timeOut(2000)

          if (isCombo) {
            await waitForAndClick(page, '#radio-pizza-fixed-price')
            await waitForAndType(page, '#product-price > input', `${menuData.price[i]}`)
          } else {
            await waitForAndClick(page, '#radio-pizza-price-based-flavor-variation')
          }

        } else {
          await timeOut(2000)
          await page.goto('https://conta.saipos.com/#/app/v2/cardapio/products/create/other?categories-products-list=%7B%22page%22:1,%22pageSize%22:25%7D', {timeout: 0})
          await timeOut(2000)

          await waitForAndType(page, '#product-price > input', `${menuData.price[i]}`)
        }

        // Cadastro dos dados do produto
        await timeOut(2000)
        await waitForAndType(page, '#categories > saipos-select > ng-select > div > div > div.ng-input > input[type=text]', `${menuData.category[i]}  `)
        await page.keyboard.press('Enter')
        await timeOut(100)
        
        await waitForAndType(page, '#product-name', `${menuData.product[i]}`)

        if (menuData.code[i].length > 0) {
          await waitForAndType(page, '#identifier-number', `${menuData.code[i]}`)
        }

        // Cadastro de adicionais
        if (menuData.additional[i][0] != "") {
          try {
            await waitForAndClick(page, '#nav-choices-tab')
            
            let err = 0
            var errAdd = []
            
            if (isPizza) {
              for (let j = 0; j < menuData.additional[i].length; j++) {
                
                var splittedMenuAdd = menuData.additional[i][j].split(' ')
                const isFlavor = splittedMenuAdd.some(item => pizza.includes(item)) && splittedMenuAdd.some(item => pizzaFlavor.includes(item))
                const isCrust = splittedMenuAdd.some(item => pizza.includes(item)) && splittedMenuAdd.some(item => pizzaCrust.includes(item))
                const isDough = splittedMenuAdd.some(item => pizza.includes(item)) && splittedMenuAdd.some(item => pizzaDough.includes(item)) 
                const isOther = (isFlavor || isCrust || isDough) ? false : true
                
                await waitForAndClick(page, '#pizzaChoicesAlreadyRegisteredMenu')
                
                if (isFlavor) {
                  await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(1) > ul > li:nth-child(2)')
                  await waitForAndClick(page, '#radio-filter-with-same-price')
                } else if (isCrust) {
                  await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(1) > ul > li:nth-child(3)')
                  await waitForAndClick(page, '#radio-filter-with-same-price')
                } else if (isDough) {
                  await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(1) > ul > li:nth-child(4)')
                  await waitForAndClick(page, '#radio-filter-with-same-price')
                } else if (isOther) {
                  await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(1) > ul > li:nth-child(5)')
                }
                
                if (isOther) {

                  await waitForAndType(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.content-header > form > div > input', `${menuData.additional[i][j]}`)
                  
                  try {
                    await waitForAndClick(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.custom-scrollbar.content-body.mt-4 > div > div:nth-child(1) > div.accordion-header.hstack.ps-3.py-2.gap-3 > div')
                    await waitForAndClick(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-primary.ms-2')
                  } catch {
                    errAdd.push(menuData.product[i])
                    await waitForAndClick(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-outline-primary.mx-2')
                  }
                
                } else {

                  const childElements = await page.$$('#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.custom-scrollbar.content-body.mt-4 > div > div')
                  console.log(childElements.length)

                  for (let l = 1; l <= childElements.length; l++) {
                    try {

                      const elementText = await page.evaluate((l) => {
                        const selector = `#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.custom-scrollbar.content-body.mt-4 > div > div:nth-child(${l}) > div.accordion-header.hstack.ps-3.py-2.gap-3 > div > label`
                        const element = document.querySelector(selector)
                        return element ? element.textContent.slice(1, -1) : null
                      }, l)
                      
                      console.log(elementText)
                      console.log(menuData.additional[i][j])

                      if (elementText == menuData.additional[i][j]) {
                        console.log("achou")
                        await waitForAndClick(page, `#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.custom-scrollbar.content-body.mt-4 > div > div:nth-child(${l}) > div.accordion-header.hstack.ps-3.py-2.gap-3 > div > label`)
                        await waitForAndClick(page, `#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-primary.ms-2`)
                        break
                      }

                      if (childElements.length == l) {
                        await waitForAndClick(page, `#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-outline-primary.mx-2`)
                      }
                      
                    } catch {
                      await waitForAndClick(page, `#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-outline-primary.mx-2`)
                      errAdd.push(menuData.product[i])
                    }
                  }
                }
              }
            } else {

              await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > button')
              
              for (let j = 0; j < menuData.additional[i].length; j++) {
                await waitForAndSelectAll(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.content-header > form > div > input')
                await waitForAndType(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.content-header > form > div > input', `${menuData.additional[i][j]}`)
                
                try {
                  await waitForAndClick(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-body.custom-scrollbar > div > div.custom-scrollbar.content-body.mt-4 > div > div:nth-child(1) > div.accordion-header.hstack.ps-3.py-2.gap-3 > div')
                } catch {
                  errAdd.push(menuData.product[i])
                  err++
                }
                
                if (j == menuData.additional[i].length - 1) {
                  if (err == menuData.additional[i].length) {
                    await waitForAndClick(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-outline-primary.mx-2')
                  } else {
                    await waitForAndClick(page, '#nav-choices > saipos-product-choices > saipos-choices-select > saipos-modal > div.modal.show > div > div > div.modal-footer > div > div > button.btn.btn-primary.ms-2')
                  }
                }           
              }
            }
            
          } catch {
            errAdd.push(menuData.product[i])
          }
        }
        
        // Cadastro da descrição
        await waitForAndClick(page, '#nav-online-sales-tab')
        await waitForAndType(page, '#product-detail-delivery', `${menuData.description[i]}`)
        
        for (let i = 0; i < 2; i++) {
          await page.keyboard.press('Tab') 
        }
        await page.keyboard.press('Enter') 
        
        // Avisos de progresso
        let end = new Date()
        if (((end - start) / 60000 ) > (k*10)) {
          console.log(`PROGRESSO PRODUTOS: ${storeId} | ${k*10} minutos | ${Math.round((i/menuData.product.length)*100)}%`)
          ipcRenderer.send('show-alert', `PROGRESSO PRODUTOS: ${storeId} | ${k*10} minutos | ${Math.round((i/menuData.product.length)*100)}%`)    
          k++
        }
        
      } catch {
        errProd.push(menuData.product[i])
        await page.goto('https://conta.saipos.com/#/', {timeout: 0})
      }
    }

    // Avisos de erros
    if (errAdd.length > 0) {
      ipcRenderer.send('show-alert', `ADICIONAIS DOS PRODUTOS NÃO CADASTRADOS: ${storeId} | ${[...new Set(errAdd)].map(item => ' ' + item)} `)
      console.log(`ADICIONAIS DOS PRODUTOS NÃO CADASTRADOS: ${storeId} | ${[...new Set(errAdd)].map(item => ' ' + item)} `)
    }

    // Avisos de erros
    if (errProd.length > 0) {
      ipcRenderer.send('show-alert', `PRODUTOS NÃO CADASTRADOS: ${storeId} | ${[...new Set(errProd)].map(item => ' ' + item)} `)
      console.log(`PRODUTOS NÃO CADASTRADOS: ${storeId} | ${[...new Set(errProd)].map(item => ' ' + item)} `)
    }
      
    // Tempo para salvar
    
    await timeOut(2000)
    await page.goto('https://conta.saipos.com/#/', {timeout: 0})
    await timeOut(2000)
    
    // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CARDÁPIO', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de CARDÁPIO, revise após a execução do programa.')
    return  ["CARDÁPIO: ",{ stack: error.stack }]
  }
}