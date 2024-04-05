const { getFromSaipos, postToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class DataDistrict {
  constructor(data) {
    this.id_city = data.id_city
    this.desc_districts = data.desc_districts.slice(1)
  }
}

class StoreDistrict {
  constructor(data) {
    this.id_store_district = 0
    this.id_district = data.id_district
    this.desc_store_district = data.desc_store_district
    this.delivery_fee = data.delivery_fee
    this.value_motoboy = data.value_motoboy
    this.enabled_site_delivery = "Y"
  }
}

async function districts(chosenData) {
  try {
    const stateId = await getFromSaipos("desc_state", chosenData.state, "id_state",`${API_BASE_URL}/states`)
    const cityId = await getFromSaipos("desc_city", chosenData.city, "id_city", `${API_BASE_URL}/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`)
    console.log(chosenData)
    const dataDistricToPost = new DataDistrict({ 
      id_city: cityId,
      desc_districts: chosenData.districtsData.districts
    })
    console.log(dataDistricToPost)
    await postToSaipos(dataDistricToPost, `${API_BASE_URL}/districts/insert-district-list`)
    
    let dataStoreToPost = []
    for (let i = 1; i < chosenData.districtsData.districts.length; i++) {
      const districtId = await getFromSaipos("desc_district", chosenData.districtsData.districts[i], "id_district", `${API_BASE_URL}/districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`)
      dataStoreToPost.push(new StoreDistrict({
        id_district: districtId,
        desc_store_district: chosenData.districtsData.districts[i],
        delivery_fee: chosenData.districtsData.deliveryFee[i],
        value_motoboy: chosenData.districtsData.deliveryMenFee[i],
      }))
      if (dataStoreToPost.length === 50 || i === chosenData.districtsData.districts.length - 1) {
        await postToSaipos(dataStoreToPost, `${API_BASE_URL}/stores/${storeId}/districts`)
        dataStoreToPost = []
      }   
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de BAIRROS', error)
    return  ["BAIRROS: ", { stack: error.stack }]
  }
}

module.exports = districts