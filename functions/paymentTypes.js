module.exports = async function paymentTypes(saiposAuthToken, storeId, chsd) {
  try {

    async function postToSaipos(paymentDescription, paymentMethod, paymentFlag) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/payment_types`
      const data = {
        "id_store_payment_type": 0,
        "desc_store_payment_type": paymentDescription,
        "payment_template": 1,
        "nfe_cod_bandeira": paymentFlag,
        "id_payment_method": paymentMethod,
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

    if (chsd.pix) { setTimeout(() => postToSaipos(paymentType[0][0],paymentType[0][1],paymentType[0][2]), delay); delay += 500 }
    if (chsd.elo) { setTimeout(() => postToSaipos(paymentType[1][0],paymentType[1][1],paymentType[1][2]), delay); delay += 500 }
    if (chsd.master) { setTimeout(() => postToSaipos(paymentType[2][0],paymentType[2][1],paymentType[2][2]), delay); delay += 500 }
    if (chsd.visa) { setTimeout(() => postToSaipos(paymentType[3][0],paymentType[3][1],paymentType[3][2]), delay); delay += 500 }
    if (chsd.amex) { setTimeout(() => postToSaipos(paymentType[4][0],paymentType[4][1],paymentType[4][2]), delay); delay += 500 }
    if (chsd.hiper) { setTimeout(() => postToSaipos(paymentType[5][0],paymentType[5][1],paymentType[5][2]), delay); delay += 500 }
    if (chsd.elo) { setTimeout(() => postToSaipos(paymentType[6][0],paymentType[6][1],paymentType[6][2]), delay); delay += 500 }
    if (chsd.master) { setTimeout(() => postToSaipos(paymentType[7][0],paymentType[7][1],paymentType[7][2]), delay); delay += 500 }
    if (chsd.visa) { setTimeout(() => postToSaipos(paymentType[8][0],paymentType[8][1],paymentType[8][2]), delay); delay += 500 }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro das FORMAS DE PAGAMENTO', error)
    return  ["FORMAS DE PAGAMENTO: ",{ stack: error.stack }]
  }
}