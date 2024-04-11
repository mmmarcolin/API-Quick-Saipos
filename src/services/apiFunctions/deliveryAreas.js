const { getFromSaipos, postToSaipos, deleteFromSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class DataDistrict {
  constructor(data) {
    this.id_city = data.id_city
    this.desc_districts = data.desc_districts.map(district => district.desc_district)
  }
}

class StoreDistrict {
  constructor(data) {
    this.id_store_district = 0
    this.id_district = data.id_district
    this.desc_store_district = data.desc_district
    this.delivery_fee = data.delivery_fee
    this.value_motoboy = data.value_motoboy
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
      radius: data.radius,
      value_motoboy: data.value_motoboy,
      delivery_fee: data.delivery_fee
    })
  }
}

async function deliveryAreas(chosenData, storeId) {
  try {
    const stateId = await getFromSaipos("desc_state", chosenData.state, "id_state", `${API_BASE_URL}/states`)
    const cityId = await getFromSaipos("desc_city", chosenData.city, "id_city", `${API_BASE_URL}/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`)

    const storeData = await getFromSaipos("id_store", storeId, "", `${API_BASE_URL}/stores/${storeId}`)

    if (storeData.delivery_area_option === "A") {
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

      chosenData.deliveryAreaData.forEach(deliveryArea => {
        areaToPost.addRadius({
          radius: deliveryArea.radius,
          value_motoboy: deliveryArea.value_motoboy,
          delivery_fee: deliveryArea.delivery_fee
        })
      })

      await postToSaipos(areaToPost, `${API_BASE_URL}/stores/${storeId}/districts/area`)
      const areaId = await getFromSaipos("properties.id_store", storeId, "id_store_district", `${API_BASE_URL}/stores/${storeId}/districts/area`)
      await deleteFromSaipos(`${API_BASE_URL}/stores/${storeId}/districts/area/${areaId}`)
    } else {
      const dataDistrictToPost = new DataDistrict({ 
        id_city: cityId,
        desc_districts: chosenData.deliveryAreasData
      })
      await postToSaipos(dataDistrictToPost, `${API_BASE_URL}/districts/insert-district-list`)

      for (const deliveryArea of chosenData.deliveryAreaData) {
        const districtId = await getFromSaipos("desc_district", deliveryArea.desc_district, "id_district", `${API_BASE_URL}/districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`)
        const storeDistrict = new StoreDistrict({
          id_district: districtId,
          desc_store_district: deliveryArea.desc_district,
          delivery_fee: deliveryArea.delivery_fee,
          value_motoboy: deliveryArea.value_motoboy
        })
        await postToSaipos(storeDistrict, `${API_BASE_URL}/stores/${storeId}/districts`)
      }
    }
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de BAIRROS', error)
    return  ["BAIRROS: ", { stack: error.stack }]
  }
}

module.exports = deliveryAreas