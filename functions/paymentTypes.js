const { ipcRenderer } = require('electron') // Módulo para comunicação com o processo principal do Electron

// Coisas a importar
require('dotenv').config()
const saiposAuthToken = process.env.SAIPOS_AUTH_TOKEN
const storeId = "17170"
const paymentsChosed = [true, true, true, true, true, false]

// module.exports = async function paymentTypes(saiposAuthToken, storeId, paymentsChosed) {
  try {

    async function postToSaipos(paymentDescription, paymentMethod, paymentFlag) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/payment_types`
      const data = {
        id_store_payment_type: 0,
        desc_store_payment_type: paymentDescription,
        payment_template: 1,
        enabled: "Y",
        on_the_arm: "N",
        order: 1,
        nfe_cod_bandeira: paymentFlag,
        id_store: storeId,
        id_payment_method: paymentMethod,
        desc_payment_template: "Sem troco"
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

    const paymentType = [
      ["Pix", 13],
      ["Crédito Elo", 3, "06"],
      ["Crédito Mastercard", 3, "02"],
      ["Crédito Visa", 3, "01"],
      ["Crédito American Express", 3, "03"],
      ["Crédito Hipercard", 3, "07"],
      ["Débito Elo", 4, "06"],
      ["Débito Mastercard", 4, "02"],
      ["Débito Visa", 4, "01"]
    ]
    
    let delay = 0

    paymentsChosed.forEach((chosen, index) => {
      if (chosen) {
        setTimeout(() => postToSaipos(paymentType[index][0],paymentType[index][1],paymentType[index][2]), delay)
        delay += 500 
    
        if (index >= 1 && index <= 3) {
          setTimeout(() => postToSaipos(paymentType[index + 5][0],paymentType[index + 5][1],paymentType[index + 5][2]), delay)
        delay += 500
        }
      }
    })

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro das FORMAS DE PAGAMENTO', error)
    ipcRenderer.send('show-alert', 'Ocorreu um erro durante o cadastro de FORMAS DE PAGAMENTO, revise após a execução do programa.')
    return  ["FORMAS DE PAGAMENTO: ",{ stack: error.stack }]
  }
// }