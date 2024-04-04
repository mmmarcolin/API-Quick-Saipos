const { postToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class DeliveryMan {
  constructor(data) {
    this.id_store_delivery_man = 0
    this.delivery_man_name = data.delivery_man_name
    this.value_daily = data.deliveryMenDailyRate
    this.id_store = storeId
    this.enabled_partner_delivery = data.delivery_man_name == "Entrega Fácil" ? "Y" : "N"
    this.id_partner_delivery = data.delivery_man_name == "Entrega Fácil" ? 4 : 0
    this.default_delivery_man = data.delivery_man_quantity == 1 ? "Y" : "N"
    this.enabled = "Y"
    this.api_login = ""
    this.partner_store_name = ""
    this.api_password = ""
    this.phone = ""
  }
}

async function deliveryMen(chosenData) {
  try {
    
    for (let i = 0; i < chosenData.deliveryMenDesc.length; i++) {
      const deliveryMenToPost = new DeliveryMan({
        delivery_man_name: chosenData.deliveryMenDesc[i],
        value_daily: chosenData.deliveryMenDailyRate[i],
        delivery_man_quantity: chosenData.deliveryMenDesc.length
      })
      await postToSaipos(deliveryMenToPost, `${API_BASE_URL}/stores/${storeId}/delivery_men`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ENTREGADORES', error)
    return  ["ENTREGADORES: ", { stack: error.stack }]
  }
}

module.exports = deliveryMen