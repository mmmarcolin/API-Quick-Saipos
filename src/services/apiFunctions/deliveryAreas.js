const { getFromSaipos, postToSaipos, deleteFromSaipos, putToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class DataDistrict {
  constructor(data) {
    this.id_city = data.id_city
    this.desc_districts = data.desc_districts.map(district => district.deliveryArea)
  }
}

class StoreDistrict {
  constructor(data) {
    this.id_store_district = 0
    this.id_district = data.id_district
    this.desc_store_district = data.desc_store_district
    this.delivery_fee = parseInt(data.delivery_fee)
    this.value_motoboy = parseInt(data.value_motoboy)
    this.enabled_site_delivery = "Y"
  }
}

class Area {
  constructor(data) {
    this.type = "Feature"
    this.geometry = {
      type: "Point",
      coordinates: data.coordinates
    }
    this.properties = {
      districts: [],
      custom_layers: [],
      id_store_district: 0,
      order: 0,
      desc_store_district: `Raios da loja ${storeId}`,
      id_city: data.id_city,
      type: "default",
      id: 0,
      style: {
        color: "#4CAF50",
        fillColor: "#4CAF50"
      },
      radius_mode: [],
      id_store: storeId
    }
  }

  addRadius(data) {
    this.properties.radius_mode.push({
      radius: parseInt(data.radius),
      value_motoboy: parseInt(data.value_motoboy),
      delivery_fee: parseInt(data.delivery_fee)
    })
  }
}

async function deliveryAreas(chosenData, storeId) {
  try {
    const stateId = await getFromSaipos("short_desc_state", chosenData.state, "id_state", `${API_BASE_URL}/states`)
    const cityId = await getFromSaipos("desc_city", chosenData.city, "id_city", `${API_BASE_URL}/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`)

    if (chosenData.deliveryOption == "A") {
      const storeData = await getFromSaipos(null, null, null, `${API_BASE_URL}/stores/${storeId}`)
      await putToSaipos({ delivery_area_option: 'A', id_store: storeId }, `${API_BASE_URL}/stores/${storeId}`)

      async function getFromZipAPI(cep) {
        const baseUrl = 'https://brasilapi.com.br/api'
        const url = `${baseUrl}/cep/v1/${cep}`

        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.statusText}`)
          }
          const responseData = await response.json()
          console.log('Response:', responseData.street)
          return responseData.street
        } catch (error) {
          console.error('Erro ao buscar dados do CEP:', error)
          return null
        }
      }

      const zipStreet = await getFromZipAPI(storeData.zip_code)
      if (zipStreet === "") {
        console.log("CEP único: incapaz de cadastrar raios")
        return
      }

      const areaToPost = new Area({
        coordinates: storeData.lat_lng.split(",").map(Number),
        id_city: cityId,
      })

      chosenData.data.slice(1).forEach(deliveryArea => {
        areaToPost.addRadius({
          radius: deliveryArea.deliveryArea,
          value_motoboy: deliveryArea.deliveryMenFee,
          delivery_fee: deliveryArea.deliveryFee
        })
      })

      await postToSaipos(areaToPost, `${API_BASE_URL}/stores/${storeId}/districts/area`)
      const areaId = await getFromSaipos("properties", storeId, "id_store_district", `${API_BASE_URL}/stores/${storeId}/districts/area`, "id_store")
      await deleteFromSaipos(`${API_BASE_URL}/stores/${storeId}/districts/area/${areaId}`)

    } else {
      await putToSaipos({ delivery_area_option: 'D' }, `${API_BASE_URL}/stores/${storeId}`)

      const districtPromises = chosenData.data.slice(1).map(deliveryArea =>
        getFromSaipos("desc_district", deliveryArea.deliveryArea, "id_district", `${API_BASE_URL}/districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`)
      )
  
      const districtIds = await Promise.all(districtPromises)
  
      const districtsBatch = []
      const postPromises = []
  
      districtIds.forEach((districtId, index) => {
        const deliveryArea = chosenData.data.slice(1)[index]
        if (districtId) { 
          const storeDistrict = new StoreDistrict({
            id_district: districtId,
            desc_store_district: deliveryArea.deliveryArea,
            delivery_fee: deliveryArea.deliveryFee,
            value_motoboy: deliveryArea.deliveryMenFee
          })
          districtsBatch.push(storeDistrict)
  
          if (districtsBatch.length === 50 || index === districtIds.length - 1) {
            if (districtsBatch.length > 0) {
              postPromises.push(postToSaipos([...districtsBatch], `${API_BASE_URL}/stores/${storeId}/districts`))
              districtsBatch.length = 0 
            }
          }
        }
      })
  
      await Promise.all(postPromises)
    }
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de BAIRROS', error)
    return  ["BAIRROS: ", { stack: error.stack }]
  }
}

module.exports = deliveryAreas
