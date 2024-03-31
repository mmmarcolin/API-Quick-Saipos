module.exports = async function orderCard(saiposAuthToken, storeId, chsd) {
  try {

    async function postOrderCard(orderCardQuantity) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/order_cards/insert-order-card-qtt`
      const data = {
        "qtd": orderCardQuantity
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

    postOrderCard(chsd.quantity)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    return  ["COMANDAS: ",{ stack: error.stack }]
  }
}