const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class Waiter {
  constructor(data) {
    this.id_store_waiter = 0
    this.desc_store_waiter = data.desc_store_waiter
    this.value_daily = data.value_daily
    this.id_store = parseInt(storeId)
    this.enabled = "Y"
  }
}

async function waiters(chosenData, storeId) {
  try {
    const waiterToPost = chosenData.map(waiterData => new Waiter ({
      desc_store_waiter: waiterData.desc,
      value_daily: waiterData.dailyRate
    }))

    await postToSaipos(waiterToPost, `${API_BASE_URL}/stores/${storeId}/store_waiters`)
    
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de GARÇONS', error)
    return  ["GARÇONS: ", { stack: error.stack }]
  }
}

module.exports = waiters