module.exports = async function waiters(saiposAuthToken, storeId, chsd) {
  try {

    async function postWaiters(waiterDesc, waiterDailyRate) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/store_waiters/`
      const data = {
        "id_store_waiter": 0,
        "desc_store_waiter": waiterDesc,
        "value_daily": waiterDailyRate,
        "id_store": storeId
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
    
    for (let i = 0; i < chsd.waiterDesc.length; i++) {
      await postWaiters(chsd.waiterDesc[i], chsd.waiterDailyRate[i])
    }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de GARÇONS', error)
    return  ["GARÇONS: ",{ stack: error.stack }]
  }
}
