const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class DeliveryMan {
  constructor(data) {
    this.id_store_delivery_man = 0
    this.delivery_man_name = data.delivery_man_name
    this.value_daily = data.value_daily
    this.id_store = storeId
    this.enabled_partner_delivery = data.delivery_man_name === "Entrega Fácil" ? "Y" : "N"
    this.id_partner_delivery = data.delivery_man_name === "Entrega Fácil" ? 4 : 0
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
    const deliveryMenPromises = chosenData.deliveryMen.map(deliveryManData => {
      const deliveryManToPost = new DeliveryMan({
        delivery_man_name: deliveryManData.deliveryManDesc,
        value_daily: deliveryManData.deliveryMenDailyRate,
        default_delivery_man: chosenData.deliveryMen.length === 1 ? "Y" : "N"
      })
      return postToSaipos(deliveryManToPost, `${API_BASE_URL}/stores/${storeId}/delivery_men`)
    })

    await Promise.all(deliveryMenPromises)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ENTREGADORES', error)
    return ["ENTREGADORES: ", { stack: error.stack }]
  }
}

module.exports = deliveryMen
