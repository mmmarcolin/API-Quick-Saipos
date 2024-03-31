module.exports = async function saleStatus(saiposAuthToken, storeId, chsd) {
  try {

    async function getSaleStatusId() {
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
  
    async function updateSaleStatus(saleStatusIds, saleStatusDescription, saleStatusTags) {
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

    async function postSaleStatus(saleStatusDescription, saleStatusTags) {
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

    const saleStatusIds = await getSaleStatusId()
    let delay = 0
    
    if (chsd.delivery) {
      setTimeout(() => updateSaleStatus(saleStatusIds[0], "Cozinha", [1, 5, 6]), delay); delay += 500
      setTimeout(() => updateSaleStatus(saleStatusIds[1], "Saiu para entrega", [3]), delay); delay += 500
      setTimeout(() => updateSaleStatus(saleStatusIds[2], "Entregue", [5]), delay); delay += 500
      setTimeout(() => postSaleStatus("Cancelados", [4]), delay)
    } else if (chsd.easyDelivery) {
      setTimeout(() => updateSaleStatus(saleStatusIds[0], "Cozinha", [1, 5, 6,21]), delay); delay += 500
      setTimeout(() => updateSaleStatus(saleStatusIds[1], "Aguardando entrega", [2, 21]), delay); delay += 500
      setTimeout(() => updateSaleStatus(saleStatusIds[2], "Saiu para entrega", [3, 20]), delay); delay += 500
      setTimeout(() => postSaleStatus("Entregue", [5]), delay); delay += 500
      setTimeout(() => postSaleStatus("Cancelados", [4]), delay)
    } 
    
  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro das STATUS DE VENDA', error)
    return  ["STATUS DE VENDA: ",{ stack: error.stack }]
  }
}