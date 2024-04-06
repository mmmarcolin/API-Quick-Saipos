const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Shift {
  constructor(data) {
    this.id_store_shift = data.id_store_shift,
    this.desc_store_shift = data.desc_store_shift,
    this.starting_time = data.starting_time,
    this.use_service_charge = data.service_charge > 0 ? "Y" : "N",
    this.service_charge = data.service_charge, 
    this.discount_payment_rate = "N",
    this.id_store = storeId
  }
}

async function shifts(chosenData) {
  try {

    const shiftId = await getFromSaipos("desc_store_shift", "Dia", "id_store_shift", `${API_BASE_URL}/stores/${storeId}/shifts`);
    
    for (const shiftData of chosenData.shifts) {
      const shiftToPost = new Shift({
        id_store_shift: chosenData.shifts.indexOf(shiftData) === 0 ? shiftId : 0,
        desc_store_shift: shiftData.desc_store_shift,
        starting_time: shiftData.shiftTime,
        service_charge: shiftData.shiftCharge
      });
    
      if (chosenData.shifts.indexOf(shiftData) === 0) {
        await putToSaipos(shiftToPost, `${API_BASE_URL}/stores/${storeId}/shifts/${shiftId}`);
      } else {
        await postToSaipos(shiftToPost, `${API_BASE_URL}/stores/${storeId}/shifts/`);
      }
    }
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de TURNOS', error)
    return  ["TURNOS: ", { stack: error.stack }]
  }
}

module.exports = shifts