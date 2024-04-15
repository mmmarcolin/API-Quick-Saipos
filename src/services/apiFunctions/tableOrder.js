const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class TableOrder {
  constructor(data) {
    this.qtd = data.qtd
  }
}

async function tableOrder(chosenData, storeId) {
  try {

    const totalQuantity = chosenData.quantity
    const batchSize = 100
    const postPromises = []

    for (let i = 0; i < totalQuantity; i += batchSize) {
      const batchQuantity = Math.min(batchSize, totalQuantity - i)
      const tableOrderToPost = new TableOrder({
        qtd: batchQuantity
      })
      postPromises.push(postToSaipos(tableOrderToPost, `${API_BASE_URL}/stores/${storeId}/tables/insert-table-qtd`))
    }

    await Promise.all(postPromises)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    return  ["MESA: ", { stack: error.stack }]
  }
}



module.exports = tableOrder