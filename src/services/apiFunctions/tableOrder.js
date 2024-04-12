const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class TableOrder {
  constructor(data) {
    this.qtd = data.qtd
  }
}

async function tableOrder(chosenData, storeId) {
  try {

    const tableOrderToPost = new TableOrder({
      qtd: chosenData.quantity
    })
    await postToSaipos(tableOrderToPost, `${API_BASE_URL}/stores/${storeId}/tables/insert-table-qtd`)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    return  ["MESA: ", { stack: error.stack }]
  }
}

module.exports = tableOrder