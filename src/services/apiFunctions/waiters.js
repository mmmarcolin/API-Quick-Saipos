const { postToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Waiter {
  constructor(data) {
    this.id_store_waiter = 0
    this.desc_store_waiter = data.desc_store_waiter
    this.value_daily = data.value_daily
    this.id_store = storeId
    this.enable = "Y"
  }
}

async function waiters(chosenData) {
  try {
    
    const promises = chosenData.waiters.map(waiterData => {
      const waiterToPost = new Waiter({
        desc_store_waiter: waiterData.desc_store_waiter,
        value_daily: waiterData.value_daily
      })
      return postToSaipos(waiterToPost, `${API_BASE_URL}/stores/${storeId}/store_waiters`)
    })

    await Promise.all(promises)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de GARÇONS', error)
    return  ["GARÇONS: ", { stack: error.stack }]
  }
}

module.exports = waiters