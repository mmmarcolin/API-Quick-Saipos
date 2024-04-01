module.exports = async function neighborhoods(saiposAuthToken, storeId, chsd) {
  try {

    async function postNeighborhoodsToData(cityId, neighborhoodDesc) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/insert-district-list/`
      const data = {
        "id_city": cityId,
        "desc_districts": neighborhoodDesc
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
        return responseData.id_district
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }
    
    async function postNeighborhoodsToStore(neighborhoods, deliveryFee, deliveryMenFee, districtIdArray) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/districts/`
      const data = {
        "id_store_district": 0,
        "id_district": districtIdArray,
        "desc_store_district": neighborhoods,
        "delivery_fee": deliveryFee,
        "value_motoboy": deliveryMenFee,
        "enabled_site_delivery": "Y"
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

    async function getStateId() {
      const url = `https://api.saipos.com/v1/states?filter%5Border%5D=desc_state`
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
        let responseData = await response.json()
        responseData = responseData.find(idState => idState.desc_state === chsd.stateDesc)
        console.log('Response:', responseData)
        return responseData.id_state
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function getCityId(stateId) {
      const url = `https://api.saipos.com/v1/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D,%22order%22:%22desc_city+asc%22%7D`
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
        let responseData = await response.json()
        responseData = responseData.find(idCity => idCity.desc_city === chsd.cityDesc)
        console.log('Response:', responseData)
        return responseData.id_city
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    const stateId = await getStateId()
    const cityId = await getCityId(stateId)

    let districtIdArray = []

    for (let i = 1; i <= chsd.neighborhoodsData.neighborhoods.length; i++) {
      districtIdArray.push = await postNeighborhoodsToData(cityId, chsd.neighborhoodsData.neighborhoods[i])
    }

    for (let i = 1; i <= chsd.neighborhoodsData.neighborhoods.length; i++) {
      await postNeighborhoodsToStore(
        chsd.neighborhoodsData.neighborhoods[i],
        chsd.neighborhoodsData.deliveryFee[i],
        chsd.neighborhoodsData.deliveryMenFee[i],
        districtIdArray[i]
      )
    }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de BAIRROS', error)
    return  ["BAIRROS: ",{ stack: error.stack }]
  }
}