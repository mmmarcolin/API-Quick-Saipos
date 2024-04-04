const { postToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class OrderCard {
  constructor(data) {
    this.qtd = data.qtd
  }
}

async function orderCard(chosenData) {
  try {

    const orderCardToPost = new OrderCard({
      qtd: chosenData.quantity
    })
    await postToSaipos(orderCardToPost, `${API_BASE_URL}/stores/${storeId}/order_cards/insert-order-card-qtt`)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    return  ["COMANDAS: ", { stack: error.stack }]
  }
}

module.exports = orderCard