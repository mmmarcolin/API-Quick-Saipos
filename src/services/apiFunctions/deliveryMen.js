const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class DeliveryMen {
  constructor(data) {
    this.id_store_delivery_man = 0
    this.delivery_man_name = data.delivery_man_name
    this.value_daily = data.value_daily
    this.id_store = storeId
    this.enabled_partner_delivery = data.delivery_man_name == "Entrega fácil" ? "Y" : "N"
    this.id_partner_delivery = data.delivery_man_name == "Entrega fácil" ? 4 : 0
    this.default_delivery_man = data.default_delivery_man
    this.enabled = "Y"
    this.api_login = ""
    this.partner_store_name = ""
    this.api_password = ""
    this.phone = ""
  }
}

async function deliveryMen(chosenData, storeId) {
  try {
    const deliveryMenPromises = chosenData.map(deliveryMenData => {
      const deliveryMenToPost = new DeliveryMen({
        delivery_man_name: deliveryMenData.desc,
        value_daily: deliveryMenData.dailyRate,
        default_delivery_man: chosenData.length === 1 ? "Y" : "N"
      })
      console.log(deliveryMenData.desc)
    
      return postToSaipos(deliveryMenToPost, `${API_BASE_URL}/stores/${storeId}/delivery_men`)
    })
    
    await Promise.all(deliveryMenPromises)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ENTREGADORES', error)
    return ["ENTREGADORES: ", { stack: error.stack }]
  }
}

module.exports = deliveryMen
