const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

// Coisas a importar
require('dotenv').config()
const saiposAuthToken = process.env.SAIPOS_AUTH_TOKEN
const storeId = "17170"
const statusChosed = [false, true, false]

// module.exports = async function users(saiposAuthToken, storeId, statusChosed) {
 
    try {
  
      async function getFromSaipos() {
        const url = `https://api.saipos.com/v1/stores/${storeId}/sale_statuses`
        const options = {
          method: 'GET',
          headers: {
            'Authorization': saiposAuthToken,
            'Content-Type': 'application/json'
          }
        }
        try {
          const response = await fetch(url, options)
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`)
          }
          const responseData = await response.json()
          console.log('Response:', responseData)
          const saleStatusIds = responseData.map(item => item.id_store_sale_status)
          return saleStatusIds
        } catch (error) {
          console.error('Error:', error)
          return null
        }
      }
    
      async function updateToSaipos(saleStatusIds, saleStatusDescription, saleStatusTags) {
        const url = `https://api.saipos.com/v1/stores/${storeId}/sale_statuses/update-validate/${saleStatusIds}`
        const data = {
          "id_store_sale_status": saleStatusIds,
          "desc_store_sale_status": saleStatusDescription,
          "id_store": storeId,
          "types": saleStatusTags
        }
        const options = {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Authorization': saiposAuthToken, 
            'Content-Type': 'application/json'
          }
        }
        try {
          const response = await fetch(url, options)
          const responseData = await response.json()
          console.log('Response:', responseData)
          return responseData
        } catch (error) {
          console.error('Error:', error)
          return null
        } 
      }

      async function postToSaipos(saleStatusDescription, saleStatusTags) {
        const url = `https://api.saipos.com/v1/stores/${storeId}/sale_statuses/`
        const data = {
          "id_store_sale_status": 0,
          "desc_store_sale_status": saleStatusDescription,
          "order": 99,
          "emit_sound_alert": "N",
          "limit_time_minutes": 30,
          "payment_check": "N",
          "id_store": storeId,
          "types": saleStatusTags,
          "steps": []
        }
        const options = {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Authorization': saiposAuthToken, 
            'Content-Type': 'application/json'
          }
        }
        try {
          const response = await fetch(url, options)
          const responseData = await response.json()
          console.log('Response:', responseData)
          return responseData
        } catch (error) {
          console.error('Error:', error)
          return null
        } 
      }


      async function fetchSaleStatusIds() {
        try {
          const saleStatusIds = await getFromSaipos()
          console.log('Sale Status IDs:', saleStatusIds)
          
          updateToSaipos(saleStatusIds[1], "Entregue", [5])

          if (statusChosed[0]) {
            updateToSaipos(saleStatusIds[1], "Entregue", [5])
          } else if (statusChosed[1]) {
            updateToSaipos(saleStatusIds[1], "Saiu para entrega", [3])
            updateToSaipos(saleStatusIds[2], "Entregue", [5])
            postToSaipos("Cancelados", [4])
          } else if (statusChosed[2]) {
            updateToSaipos(saleStatusIds[1], "Aguardando entrega", [2])
            updateToSaipos(saleStatusIds[2], "Saiu para entrega", [3])
            updateToSaipos("Entregue", [5])
            updateToSaipos("Cancelados", [4])
          }
          

        } catch (error) {
          console.error('Erro ao recuperar os Sale Status IDs:', error)
        }
      }

      fetchSaleStatusIds()
      
      // const saleStatusIds = fetchSaleStatusIds()
// 
      // async function postToSaipos(apiCommand, apiMethod, statusChosed) {
      //   const url = `https://api.saipos.com/v1/stores/${storeId}/sale_status_types`
      //   const data = {
      //     id_store_payment_type: 0,
      //     desc_store_payment_type: paymentDescription,
      //     payment_template: 1,
      //     enabled: "Y",
      //     on_the_arm: "N",
      //     order: 1,
      //     nfe_cod_bandeira: paymentFlag,
      //     id_store: storeId,
      //     id_payment_method: paymentMethod,
      //     desc_payment_template: "Sem troco"
      //   }
      //   const options = {
      //     method: 'POST',
      //     body: JSON.stringify(data),
      //     headers: {
      //       'Authorization': saiposAuthToken, 
      //       'Content-Type': 'application/json'
      //     }
      //   }
      //   try {
      //     const response = await fetch(url, options)
      //     const responseData = await response.json()
      //     console.log('Response:', responseData)
      //     return responseData
      //   } catch (error) {
      //     console.error('Error:', error)
      //     return null
      //   } 
      // }
      
      // if (statusChosed[0]) {
      //   postToSaipos()
      // } else if (statusChosed[1]) {
      //   postToSaipos()
      // } else if (statusChosed[2]) {
      //   postToSaipos()
      // }

      // postToSaipos()








      // const paymentType = [
      //   ["Pix", 13],
      //   ["Crédito Elo", 3, "06"],
      //   ["Crédito Mastercard", 3, "02"],
      //   ["Crédito Visa", 3, "01"],
      //   ["Crédito American Express", 3, "03"],
      //   ["Crédito Hipercard", 3, "07"],
      //   ["Débito Elo", 4, "06"],
      //   ["Débito Mastercard", 4, "02"],
      //   ["Débito Visa", 4, "01"]
      // ]
      
      // let delay = 0
  
      // paymentsChosed.forEach((chosen, index) => {
      //   if (chosen) {
      //     setTimeout(() => postToSaipos(paymentType[index][0],paymentType[index][1],paymentType[index][2]), delay)
      //     delay += 500 
      
      //     if (index >= 1 && index <= 3) {
      //       setTimeout(() => postToSaipos(paymentType[index + 5][0],paymentType[index + 5][1],paymentType[index + 5][2]), delay)
      //     delay += 500
      //     }
      //   }
      // })
  
    // Tratamento de erros
    } catch (error) {
      console.error('Ocorreu um erro durante o cadastro das FORMAS DE PAGAMENTO', error)
      ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de FORMAS DE PAGAMENTO, revise após a execução do programa.')
      return  ["FORMAS DE PAGAMENTO: ",{ stack: error.stack }]
    }
  // }


























//   try {

//     // Acesso à página
//     await page.goto('https://conta.saipos.com/#/app/store/sale-status', {timeout: 0})

//     // Agrega tudo na cozinha
//     await waitForAndClick(page, '#content > data > div > base-crud > div > div > base-crud-data-table > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > div.text-center > button.btn.btn-default.ng-scope.waves-effect')
//     await timeOut(1500)
//     await waitForAndClick(page, '#types_chosen')
//     await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(5)')

//     // Se tiver Entrega Fácil, seleciona EF - Verificar disponibilidade
//     if (easyDelivery) {
//       await timeOut(1500)
//       await waitForAndClick(page, '#types_chosen')
//       await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(18)')
//     }
//     await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
//     await waitForAndClick(page, 'body > div:nth-child(10) > div.sweet-alert.showSweetAlert.visible > p:nth-child(8) > button.confirm.btn.btn-lg.btn-primary')

//     // Exclui pré cadastrados
//     await waitForAndClick(page, '#content > data > div > base-crud > div > div > base-crud-data-table > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > div.text-center > button:nth-child(2)')
//     await waitForAndClick(page, 'body > div:nth-child(10) > div.sweet-alert.showSweetAlert.visible > p:nth-child(8) > button.confirm.btn.btn-lg.btn-warning')
//     try {
//       await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.p-10.ng-scope > div > div > div > div > div > div > div > a')
//       await page.keyboard.press('Enter')
//       await timeOut(3000)
//       await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-l-10.p-r-10.p-b-10.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
//     } catch {}

//     await waitForAndClick(page, '#content > data > div > base-crud > div > div > base-crud-data-table > div > table > tbody > tr:nth-child(2) > td:nth-child(3) > div.text-center > button:nth-child(2)')
//     await waitForAndClick(page, 'body > div:nth-child(10) > div.sweet-alert.showSweetAlert.visible > p:nth-child(8) > button.confirm.btn.btn-lg.btn-warning')
//     try {
//       await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-body.p-10.ng-scope > div > div > div > div > div > div > div > a')
//       await page.keyboard.press('Enter')
//       await timeOut(3000)
//       await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-l-10.p-r-10.p-b-10.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
//     } catch {}
            
//     // Se tiver Entrega Fácil, cria Aguardando entrega e seleciona EF - Verificar disponibilidade
//     if (easyDelivery) {
//       await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
//       await page.keyboard.type('Aguardando entrega')
//       await timeOut(1500)
//       await waitForAndClick(page, '#types_chosen')
//       await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(2)')
//       await timeOut(1500)
//       await waitForAndClick(page, '#types_chosen')
//       await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(18)')
//       await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
//     }

//     // Cadastro da Saiu para entrega
//     await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
//     await page.keyboard.type('Saiu para entrega')
//     await timeOut(1500)
//     await waitForAndClick(page, '#types_chosen')
//     await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(3)')

//     // Se tiver Entrega Fácil, seleciona EF - Solicitar entrega
//     if (easyDelivery) {
//       await timeOut(1500)
//       await waitForAndClick(page, '#types_chosen')
//       await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(17)')
//     }
//     await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')

//     // Cadastro da Entregue
//     await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
//     await page.keyboard.type('Entregue')
//     await timeOut(1500)
//     await waitForAndClick(page, '#types_chosen')
//     await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(5)')
//     await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
//     await waitForAndClick(page, 'body > div:nth-child(10) > div.sweet-alert.showSweetAlert.visible > p:nth-child(8) > button.confirm.btn.btn-lg.btn-primary')
    
//     // Cadastro da Cancelado
//     await waitForAndClick(page, '#content > data > div > base-crud > div > base-crud-title > div > button')
//     await page.keyboard.type('Cancelado')
//     await timeOut(1500)
//     await waitForAndClick(page, '#types_chosen')
//     await waitForAndClick(page, '#types_chosen > div > ul > li:nth-child(4)')
//     await waitForAndClick(page, 'body > div.modal.fade.ng-isolate-scope.clientweb-scope.in > div > div > div.modal-footer.p-t-0.ng-scope > button.btn.btn-primary.m-b-0.waves-effect')
    
//     // Tempo para salvar
//     await timeOut(2000)
//     await page.goto('https://conta.saipos.com/#/', {timeout: 0})
//     await timeOut(2000)

//   // Tratamento de erros
//   } catch (error) {
//     console.error('Ocorreu um erro durante o cadastro dos STATUS DE VENDA', error)
//     ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de STATUS DE VENDA, revise após a execução do programa.')
//     return  ["STATUS DE VENDA: ",{ stack: error.stack }]
//   }
// }