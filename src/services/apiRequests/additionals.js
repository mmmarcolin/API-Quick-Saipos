module.exports = async function additionals(saiposAuthToken, storeId, chsd) {
  try {
    class Additional {
      constructor({
        desc_store_choice = "",
        choice_type = null,
        min_choices = null,
        max_choices = null,
        calc_method = null,
        generic_use = "",
        group_items_print = "",
        kind = ""
      } = {}) {
        this.id_store = storeId
        this.id_store_choice = 0
        this.desc_store_choice = desc_store_choice
        this.choice_type = choice_type
        this.min_choices = min_choices
        this.max_choices = max_choices
        this.calc_method = calc_method
        this.generic_use = generic_use
        this.group_items_print = group_items_print
        this.choice_items = []
        this.kind = kind
      }

      addItem(choiceItem) {
        this.choice_items.push(new Item(choiceItem))
      }
    }
    
    class Item {
      constructor({
        desc_store_choice_item = "",
        aditional_price = null,
        detail = "",
        code = "",
        id_store_choice_item = null,
        id_store_choice = null,
        id_store_variation = null,
      } = {}) {
        this.id_store_choice_item = id_store_choice_item
        this.desc_store_choice_item = desc_store_choice_item
        this.id_store_choice = id_store_choice
        this.detail = detail
        this.code = code
        this.enabled = "Y"
        this.variations = [
          {
            id_store_choice_item_variation: 0,
            id_store_choice_item: id_store_choice_item, 
            id_store_variation: id_store_variation,
            aditional_price: aditional_price,
            enabled: "Y"
          }
        ]
      }
    }

    const additionals = [] 

    let i = 1

    while (chsd.additionalsData.additional[i] !== chsd.additionalsData.additional[i-1] || i == 1) {
      additionals.push(new Additional({
        desc_store_choice: chsd.additionalsData.additional[i],
        choice_type: null,
        min_choices: chsd.additionalsData.quantity[i].split(",")[0],
        max_choices: chsd.additionalsData.quantity[i].split(",")[1],
        calc_method: null,
        generic_use: "",
        group_items_print: "",
        kind: ""
      }))
      chsd.additionalsData.additional[i] == chsd.additionalsData.additional[i+1] ? i++ : i = j
    }

    for (let i = 1; i < chsd.additionalsData.additional.length; i++) {  
      additionals.push(new Additional({
        desc_store_choice: chsd.additionalsData.additional[i],
        choice_type: null,
        min_choices: chsd.additionalsData.quantity[i].split(",")[0],
        max_choices: chsd.additionalsData.quantity[i].split(",")[1],
        calc_method: null,
        generic_use: "",
        group_items_print: "",
        kind: ""
      }))

      let j = i

      // do {
      //   console.log(j)
      //   additionals[i-1].addItem({
      //     desc_store_choice_item: chsd.additionalsData.item[j],
      //     aditional_price: chsd.additionalsData.price[j],
      //     detail: chsd.additionalsData.description[j],
      //     code: chsd.additionalsData.code[j],
      //     id_store_choice_item: null,
      //     id_store_choice: null,
      //     id_store_variation: null,
      //   })
      //   chsd.additionalsData.additional[j] == chsd.additionalsData.additional[j+1] ? j++ : i = j
      // } while (chsd.additionalsData.additional[j] == chsd.additionalsData.additional[j-1])


      while (chsd.additionalsData.additional[j] == chsd.additionalsData.additional[j+1] || j == 1) {
        additionals[i-1].addItem({
          desc_store_choice_item: chsd.additionalsData.item[j],
          aditional_price: chsd.additionalsData.price[j],
          detail: chsd.additionalsData.description[j],
          code: chsd.additionalsData.code[j],
          id_store_choice_item: null,
          id_store_choice: null,
          id_store_variation: null,
        })
        chsd.additionalsData.additional[j] == chsd.additionalsData.additional[j+1] ? j++ : i = j
      }
    }

    console.log(additionals)

    // additionals.forEach((additional, additionalIndex) => {
    //   console.log(`Additional ${additionalIndex + 1}: ${JSON.stringify(additional, null, 2)}`);
    //   additional.choice_items.forEach((item, index) => {
    //     console.log(`Item ${index + 1}: ${JSON.stringify(item, null, 2)}`)
    //   })
    // })








//     https://api.saipos.com/v1/stores/33738/variations?filter=%7B%22where%22:%7B%22is_unique%22:%22Y%22%7D%7D
// GET


//     async function postNeighborhoodsToData(cityId, neighborhoodDesc) {
//       const url = `https://api.saipos.com/v1/districts/insert-district-list`
//       const data = {
//         "id_city": cityId,
//         "desc_districts": [neighborhoodDesc]
//       }
//       const options = {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//           'Authorization': saiposAuthToken, 
//           'Content-Type': 'application/json'
//         }
//       }
//       try {
//         const response = await fetch(url, options)
//         const responseData = await response.json()
//         console.log('Response:', responseData)
//         return responseData
//       } catch (error) {
//         console.error('Error:', error)
//         return null
//       } 
//     }
    
//     async function postNeighborhoodsToStore(neighborhoods, deliveryFee, deliveryMenFee, districtIdArray) {
//       const url = `https://api.saipos.com/v1/stores/${storeId}/districts/`
//       console.log(neighborhoods, deliveryFee, deliveryMenFee, districtIdArray)
//       const data = {
//         "id_store_district": 0,
//         "id_district": districtIdArray,
//         "desc_store_district": neighborhoods,
//         "delivery_fee": deliveryFee,
//         "value_motoboy": deliveryMenFee,
//         "enabled_site_delivery": "Y"
//       }
//       const options = {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//           'Authorization': saiposAuthToken, 
//           'Content-Type': 'application/json'
//         }
//       }
//       try {
//         const response = await fetch(url, options)
//         const responseData = await response.json()
//         console.log('Response:', responseData)
//         return responseData
//       } catch (error) {
//         console.error('Error:', error)
//         return null
//       } 
//     }

//     async function getStateId() {
//       const url = `https://api.saipos.com/v1/states?filter%5Border%5D=desc_state`
//       const options = {
//         method: 'GET',
//         headers: {
//           'Authorization': saiposAuthToken,
//           'Content-Type': 'application/json'
//         }
//       }
    
//       try {
//         const response = await fetch(url, options)
//         if (!response.ok) {
//           throw new Error(`Erro na requisição: ${response.statusText}`)
//         }
//         let responseData = await response.json()
//         responseData = responseData.find(idState => idState.desc_state === chsd.stateDesc)
//         console.log('Response:', responseData)
//         return responseData.id_state
//       } catch (error) {
//         console.error('Error:', error)
//         return null
//       }
//     }

//     async function getCityId(stateId) {
//       const url = `https://api.saipos.com/v1/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D,%22order%22:%22desc_city+asc%22%7D`
//       const options = {
//         method: 'GET',
//         headers: {
//           'Authorization': saiposAuthToken,
//           'Content-Type': 'application/json'
//         }
//       }
    
//       try {
//         const response = await fetch(url, options)
//         if (!response.ok) {
//           throw new Error(`Erro na requisição: ${response.statusText}`)
//         }
//         let responseData = await response.json()
//         responseData = responseData.find(idCity => idCity.desc_city === chsd.cityDesc)
//         console.log('Response:', responseData)
//         return responseData.id_city
//       } catch (error) {
//         console.error('Error:', error)
//         return null
//       }
//     }

//     async function getDistrictId(cityId, districtDesc) {
//       const url = `https://api.saipos.com/v1/districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`
//       const options = {
//         method: 'GET',
//         headers: {
//           'Authorization': saiposAuthToken,
//           'Content-Type': 'application/json'
//         }
//       }
    
//       try {
//         const response = await fetch(url, options)
//         if (!response.ok) {
//           throw new Error(`Erro na requisição: ${response.statusText}`)
//         }
//         let responseData = await response.json()

//         responseData = responseData.find(district => 
//           district.desc_district.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "") ==
//           districtDesc.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "")
//         )
//         console.log('Response:', responseData.id_district)
//         return responseData.id_district
//       } catch (error) {
//         console.error('Error:', error)
//         return null
//       }
//     }


//   // Tratamento de erros
//   } catch (error) {
//     console.error('Ocorreu um erro durante o cadastro de ADICIONAIS', error)
//     return  ["ADICIONAIS: ",{ stack: error.stack }]
//   }
// }





// module.exports = async function additionals(page, additionalsData, storeId, pizzaBigger, pizzaProportional) {
//   try {
//     // Lista auxiliares de inclusão
//     const pizzaDough = [
//       'Massa', 'MASSA', 'massa', 
//       'Massas', 'MASSAS', 'massas'
//     ]

//     const pizzaCrust = [
//       'Borda', 'BORDA', 'borda',
//       'Bordas', 'BORDAS', 'bordas'
//     ]

//     const pizzaFlavor = [
//       'Sabor', 'SABOR', 'sabor',
//       'Sabores', 'SABORES', 'sabores'
//     ]

//     const pizza = [
//       'Pizza', 'PIZZA', 'pizza',
//       'Pizzas', 'PIZZAS', 'pizzas'
//     ]

//     let k = 1
//     let err = []     
//     const start = new Date()

//     // Cadastro de adicionais
//     for (let i = 1; i < additionalsData.item.length; i++) {
//       try {
        
//         var splittedAdditional = additionalsData.additional[i].split(' ')
//         const isFlavor = splittedAdditional.some(item => pizza.includes(item)) && splittedAdditional.some(item => pizzaFlavor.includes(item))
//         const isCrust = splittedAdditional.some(item => pizza.includes(item)) && splittedAdditional.some(item => pizzaCrust.includes(item))
//         const isDough = splittedAdditional.some(item => pizza.includes(item)) && splittedAdditional.some(item => pizzaDough.includes(item)) 
//         const isOther = (isFlavor || isCrust || isDough) ? false : true

//         //Acesso à página de adicionais
//         await page.goto('https://conta.saipos.com/#/app/v2/cardapio/products/create/pizza?categories-products-list=%7B%22page%22:1,%22pageSize%22:25%7D', {timeout: 0})
//         await timeOut(2000)

//         await waitForAndClick(page, '#nav-choices-tab')
//         await waitForAndClick(page, '#pizzaChoicesMenu')

//         if (isFlavor) {
//           await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(2) ')
//         } else if (isCrust) {
//           await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(3) ')
//         } else if (isDough) {
//           await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(4)')
//         } else if (isOther) {
//           await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > div.hstack > div:nth-child(2) > ul > li:nth-child(5)')
//         }

//         await waitForAndSelectAll(page,'#choice-name')
//         await waitForAndType(page, '#choice-name', `${additionalsData.additional[i]}`)
        
//         if (!isDough) {
//           await waitForAndSelectAll(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(2) > input')
//           await waitForAndType(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(2) > input', `${additionalsData.quantity[i][0]}`)
//           await waitForAndSelectAll(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(3) > input')
//           await waitForAndType(page, '#nav-basic-data > div > div.card.choice-items > div > div > div:nth-child(3) > input', `${additionalsData.quantity[i][1]}`)

//           if (pizzaBigger && !isOther) {
//             await waitForAndClick(page, '#nav-basic-data > div > div.d-flex.justify-content-between.mb-5 > div.d-flex.flex-fill.flex-column > div.me-4.mt-4.col-product-name.flex-fill > saipos-select > ng-select > div')
//             await page.keyboard.press('ArrowDown') 
//             await timeOut(200)
//             await page.keyboard.press('Enter')      
//             await timeOut(200)
//           }
//         }

//         let j = i
//         await waitForAndClick(page, '#nav-basic-data > div > div.card.choice-items > table > tbody > tr.ng-untouched.ng-pristine.ng-valid > td:nth-child(2) > input')
//         await page.keyboard.type(additionalsData.item[j])
//         await timeOut(500)
//         await page.keyboard.press('Tab')      
//         await timeOut(500)
//         await page.keyboard.type(additionalsData.price[j])      
//         await timeOut(500)
//         await page.keyboard.press('Tab')      
//         await timeOut(500)
//         await page.keyboard.type(additionalsData.code[j])      
//         await timeOut(500)
//         await page.keyboard.press('Tab')      
//         await timeOut(500)
//         await page.keyboard.press('Tab')      
//         await timeOut(500)
//         j++

//         while (additionalsData.additional[j] == additionalsData.additional[j-1]) {
//           await page.keyboard.press('Enter')      
//           await timeOut(500)
//           await page.keyboard.type(additionalsData.item[j])
//           await timeOut(500)
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           await page.keyboard.type(additionalsData.price[j])      
//           await timeOut(500)
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           await page.keyboard.type(additionalsData.code[j])      
//           await timeOut(500)
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           j++
//         } 
//         j--
        
//         await waitForAndClick(page, '#nav-detail-data-tab')
        
//         await waitForAndClick(page, '#choice-item-detail-delivery')
//         await page.keyboard.type(additionalsData.description[i])
//         await timeOut(500)
//         i++
        
//         while (additionalsData.additional[i] == additionalsData.additional[i-1]) {
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           await page.keyboard.press('Tab')      
//           await timeOut(500)
//           await page.keyboard.type(additionalsData.description[i])
//           await timeOut(500)
//           i++

//           // Avisos de progresso
//           let end = new Date()
//           if (((end - start) / 60000 ) > (k*10)) {
//             console.log(`PROGRESSO ADICIONAIS: ${storeId} | ${k*10} minutos | ${Math.round((i/additionalsData.item.length)*100)}%`)
//             ipcRenderer.send('show-alert', `PROGRESSO ADICIONAIS: ${storeId} | ${k*10} minutos | ${Math.round((i/additionalsData.item.length)*100)}%`)    
//             k++
//           }
//         }
//         i--

//         await page.keyboard.press('Tab')      
//         await timeOut(500)
//         await page.keyboard.press('Tab')      
//         await timeOut(500)
//         await page.keyboard.press('Enter') 
//         await timeOut(500)

//         await waitForAndClick(page, '#nav-choices > saipos-product-choices > div > ul > li > div > div.choices-list-item-header > div.hstack.gap-3.pe-5.py-2 > button')
        
//       } catch {
//         err.push(additionalsData.additional[i])
//         await page.goto('https://conta.saipos.com/#/', {timeout: 0})
//       }
//     }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ADICIONAIS', error)
    return  ["ADICIONAIS: ",{ stack: error.stack }]
  }
}