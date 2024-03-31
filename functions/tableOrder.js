module.exports = async function tableOrder(saiposAuthToken, storeId, chsd) {
  try {

    async function postTableOrder(tableQuantity) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/tables/insert-table-qtd`
      const data = {
        "qtd": tableQuantity
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

    postTableOrder(chsd.quantity)

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    return  ["COMANDAS: ",{ stack: error.stack }]
  }
}