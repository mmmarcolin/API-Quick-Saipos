const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL, normalizeText } = require("../../utils/auxiliarVariables.js")

class PartnerEnable {
  constructor(data) {
    this.id_store_partner_sale = 0
    this.enabled = "Y"
    this.id_store = storeId
    this.id_partner_sale = data.partnerId
  }
}

class Site {
  constructor(data) {
    this.pickup_counter = data.pickupCounter
    this.url_site = `${normalizeText(data.url_site)}.saipos.com`
    this.primary_color = "#000000"
    this.address_config = 2
    this.minimum_value = data.minimumValue
    this.id_store = storeId
    this.id_photo_site_cover = 25
    this.id_photo_site_background = 71
    this.config_type = "sitedelivery"
  }
}

class Menu {
  constructor(data) {
    this.url_site = `${normalizeText(data.url_site)}.saipos.com`
    this.primary_color = "#000000"
    this.id_store = storeId
    this.id_photo_site_cover = 25
    this.online_order_enabled = data.premiumMenu
  }
}

class Schedule {
  constructor() {
    this.upsert = []
  }

  addWeekDay(data) {
    this.upsert.push(new WeekDay(data))
  }
}

class WeekDay {
  constructor(data) {
    this.id_store = storeId
    this.day_week = data.day_week
    this.start_time = data.start_time
    this.end_time = data.end_time
    this.new = true
    this.start_schedule_time = ""
    this.end_schedule_time = ""
    this.enable_edit = false
  }
}

class PaymentType {
  constructor() {
    this.upsert = []
  }

  addPayment(data) {
    this.upsert.push(new Payment(data))
  }
}

class Payment {
  constructor(data) {
    this.id_store_payment_type = data.id_store_payment_type
    this.id_payment_type = data.id_payment_type
    this.new = true
  }
}

async function partners(chosenData) {
  try {
    const desiredPayments = [
      "Pix",
      "Dinheiro",
      "Crédito",
      "Débito",
      "Crédito Elo",
      "Crédito Mastercard",
      "Crédito Visa",
      "Crédito American Express",
      "Crédito Hipercard",
      "Débito Elo",
      "Débito Mastercard",
      "Débito Visa"
    ]

    const paymentIds = await Promise.all(desiredPayments.map(paymentType =>
      getFromSaipos("desc_store_payment_type", paymentType, "id_store_payment_type", `${API_BASE_URL}/stores/${storeId}/payment_types`)
    ))

    const storePaymentId = {}
    desiredPayments.forEach((paymentType, index) => {
      storePaymentId[paymentType] = paymentIds[index]
    })

    const operations = []

    if (chosenData.deliverySite) {
      operations.push((async () => {
        const enableToPost = new PartnerEnable({ partnerId: 7 })
        await postToSaipos(enableToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/enable_partner_sale`)

        const siteId = await getFromSaipos("id_store", storeId, "id_store_site_data", `${API_BASE_URL}/stores/${storeId}/site_data`)
        const siteToPost = new Site({
          pickupCounter: chosenData.pickupCounter,
          url_site: chosenData.storeName,
          minimumValue: chosenData.minimumValue
        })

        if (siteId === "") {
          await postToSaipos(siteToPost, `${API_BASE_URL}/stores/${storeId}/site_data`)
        } else {
          await putToSaipos(siteToPost, `${API_BASE_URL}/stores/${storeId}/site_data/${siteId}`)
        }
      })())
    }

    if (chosenData.basicMenu || chosenData.premiumMenu) {
      operations.push((async () => {
        const enableToPost = new PartnerEnable({ partnerId: 32 })
        await postToSaipos(enableToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/enable_partner_sale`)

        const menuId = await getFromSaipos("id_store", storeId, "id_store_table_data", `${API_BASE_URL}/stores/${storeId}/table_data`)
        const menuToPost = new Menu({
          premiumMenu: chosenData.premiumMenu,
          url_site: chosenData.storeName
        })

        if (menuId === "") {
          await postToSaipos(menuToPost, `${API_BASE_URL}/stores/${storeId}/table_data`)
        } else {
          await putToSaipos(menuToPost, `${API_BASE_URL}/stores/${storeId}/table_data/${menuId}`)
        }
      })())
    }

    await Promise.all(operations)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CANAIS DE VENDA', error)
    return ["CANAIS DE VENDA: ", { stack: error.stack }]
  }
}

module.exports = partners
