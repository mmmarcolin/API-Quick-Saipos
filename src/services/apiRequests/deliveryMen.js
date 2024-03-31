module.exports = async function deliveryMen(saiposAuthToken, storeId, chsd) {
  try {

    async function postDeliveryMen(deliveryMenDesc, deliveryMenDailyRate) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/delivery_men/`
      const data = {
        "id_store_delivery_man": 0,
        "delivery_man_name": deliveryMenDesc,
        "value_daily": deliveryMenDailyRate,
        "id_store": storeId,
        "enabled_partner_delivery": deliveryMenDesc == "Entrega Fácil" ? "Y" : "N",
        "id_partner_delivery": deliveryMenDesc == "Entrega Fácil" ? 4 : 0,
        "default_delivery_man": chsd.deliveryMenDesc.length == 1 ? "Y" : "N"
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
    
    for (let i = 0; i < chsd.deliveryMenDesc.length; i++) {
      await postDeliveryMen(chsd.deliveryMenDesc[i], chsd.deliveryMenDailyRate[i])
    }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ENTREGADORES', error)
    return  ["ENTREGADORES: ",{ stack: error.stack }]
  }
}