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
    
    const paymentMappings = {
      Pix: 'pix',
      Dinheiro: 'money',
      'Crédito': 'cre',
      'Débito': 'deb',
      'Crédito Elo': 'creElo',
      'Crédito Mastercard': 'creMaster',
      'Crédito Visa': 'creVis',
      'Crédito American Express': 'creAmex',
      'Crédito Hipercard': 'creHiper',
      'Débito Elo': 'debElo',
      'Débito Mastercard': 'debMaster',
      'Débito Visa': 'debVisa'
    }
    
    const saiposPaymentId = {
      pix: 54,
      money: 9,
      cre: 52,
      deb: 53,
      creElo: 21,
      creMaster: 21,
      creVis: 18,
      creAmex: 15,
      creHiper: 20,
      debElo: 22,
      debMaster: 3,
      debVisa: 5
    }
    
    const storePaymentId = {}
    for (const paymentType of desiredPayments) {
      storePaymentId[paymentType] = await getFromSaipos("desc_store_payment_type", paymentType, "id_store_payment_type", `${API_BASE_URL}/stores/${storeId}/payment_types`)
    }

    for (const [day, value] of Object.entries(chosenData.weekDays)) {
      if (value) {
        const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day) + 1
        var scheduleToPost = new Schedule

        scheduleToPost.addWeekDay({
          day_week: dayIndex,
          start_time: chosenData.startTime,
          end_time: data.endTime
        })
      }
    }

    for (const paymentType of desiredPayments) {
      const saiposPaymentKey = paymentMappings[paymentType]
      const paymentId = saiposPaymentKey ? saiposPaymentId[saiposPaymentKey] : null
      const storePaymentType = storePaymentId[paymentType]
      var paymentToPost = new PaymentType()
      paymentToPost.addPayment({
        id_store_payment_type: storePaymentType,
        id_payment_type: paymentId
      })
    }

    if (chosenData.deliverySite) {
      const enableToPost = new PartnerEnable({ id_partner_sale: 7 })
      await postToSaipos(enableToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/enable_partner_sale`)

      const siteId = await getFromSaipos("id_store", storeId, "id_store_site_data", `${API_BASE_URL}/stores/${storeId}/site_data`)
      const siteToPost = new Site({
        pickup_counter: chosenData.pickupCounter,
        url_site: chosenData.storeName,
        minimum_value: chosenData.minimumValue
      })

      siteId === "" ? 
      await postToSaipos(siteToPost, `${API_BASE_URL}/stores/${storeId}/site_data/${siteId}`) : 
      await putToSaipos(siteToPost, `${API_BASE_URL}/stores/${storeId}/site_data/${siteId}`)

      await postSchedule(scheduleToPost, `${API_BASE_URL}/stores/${storeId}/schedules_service/insert-all`)
      await postPayment(paymentsToPost, `${API_BASE_URL}/stores/${storeId}/site-delivery/upsert-payment-types`)
    }
    
    if (chosenData.basicMenu || chosenData.premiumMenu) {
      const enableToPost = new PartnerEnable({ id_partner_sale: 32 })
      await postToSaipos(enableToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/enable_partner_sale`)

      const menuId = await getFromSaipos("id_store", storeId, "id_store_table_data", `${API_BASE_URL}/stores/${storeId}/table_data`)
      const menuToPost = new Menu({
        online_order_enabled: chosenData.premiumMenu,
        url_site: chosenData.storeName
      })

      menuId === "" ? 
      await postToSaipos(menuToPost, `${API_BASE_URL}/stores/${storeId}/site_data/${menuId}`) : 
      await putToSaipos(menuToPost, `${API_BASE_URL}/stores/${storeId}/site_data/${menuId}`)

      await postSchedule(scheduleToPost, `${API_BASE_URL}/stores/${storeId}/table_data_schedules_service/insert-all`)
      await postPayment(paymentsToPost, `${API_BASE_URL}/stores/${storeId}/digital-table/upsert-payment-types`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CANAIS DE VENDA', error)
    return  ["CANAIS DE VENDA: ", { stack: error.stack }]
  }
}

module.exports = partners