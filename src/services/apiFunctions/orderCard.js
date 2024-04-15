const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class OrderCard {
  constructor(data) {
    this.qtd = data.qtd
  }
}

async function orderCard(chosenData, storeId) {
  try {
    const totalQuantity = chosenData.quantity
    const batchSize = 100
    const postPromises = []

    for (let i = 0; i < totalQuantity; i += batchSize) {
      const batchQuantity = Math.min(batchSize, totalQuantity - i)
      const orderCardToPost = new OrderCard({
        qtd: batchQuantity
      })
      postPromises.push(postToSaipos(orderCardToPost, `${API_BASE_URL}/stores/${storeId}/order_cards/insert-order-card-qtt`))
    }

    await Promise.all(postPromises)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de MESAS', error)
    return  ["COMANDAS: ", { stack: error.stack }]
  }
}

module.exports = orderCard