const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class Shift {
  constructor(data) {
    this.id_store_shift = data.id_store_shift,
    this.desc_store_shift = data.desc_store_shift,
    this.starting_time = data.starting_time.replace(/(\d{2})(\d{2})/, '$1:$2'),
    this.use_service_charge = data.service_charge > 0 ? "Y" : "N",
    this.service_charge = data.service_charge, 
    this.discount_payment_rate = "N",
    this.id_store = storeId
  }
}

async function shifts(chosenData, storeId) {
  try {
    const shiftId = await getFromSaipos("id_store", storeId, "id_store_shift", `${API_BASE_URL}/stores/${storeId}/shifts`)

    const operations = chosenData.map((shiftData, index) => {
      const shiftToPost = new Shift({
        id_store_shift: index === 0 ? shiftId : 0,
        desc_store_shift: shiftData.desc,
        starting_time: shiftData.time,
        service_charge: shiftData.serviceFee
      })
      if (index === 0) {
        return putToSaipos(shiftToPost, `${API_BASE_URL}/stores/${storeId}/shifts/${shiftId}`)
      } else {
        return postToSaipos(shiftToPost, `${API_BASE_URL}/stores/${storeId}/shifts/`)
      }
    })

    await Promise.all(operations)
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de TURNOS', error)
    return ["TURNOS: ", { stack: error.stack }]
  }
}

module.exports = shifts
