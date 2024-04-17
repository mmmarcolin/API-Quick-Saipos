const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class SaleStatus {
  constructor(data) {
    this.id_store_sale_status = data.id_store_sale_status
    this.desc_store_sale_status = data.desc_store_sale_status
    this.order = data.order
    this.emit_sound_alert = "Y"
    this.limit_time_minutes = 30
    this.payment_check = "N"
    this.id_store = storeId
    this.types = data.types
    this.steps = []
  }
}

async function updateSaleStatus(saleStatusData) {
  const saleStatusToPust = new SaleStatus(saleStatusData)
  const endpoint = saleStatusData.id_store_sale_status === 0 ?
    `${API_BASE_URL}/stores/${storeId}/sale_statuses` :
    `${API_BASE_URL}/stores/${storeId}/sale_statuses/update-validate/${saleStatusData.id_store_sale_status}`
  return saleStatusData.id_store_sale_status === 0 ?
    postToSaipos(saleStatusToPust, endpoint) :
    putToSaipos(saleStatusToPust, endpoint)
}

async function saleStatus(chosenData, storeId) {
  try {
    const [firstSlSt, secondSlSt, thirdSlSt] = await Promise.all([
      getFromSaipos("desc_store_sale_status", "Cozinha", "id_store_sale_status", `${API_BASE_URL}/stores/${storeId}/sale_statuses`),
      getFromSaipos("desc_store_sale_status", "Entregue", "id_store_sale_status", `${API_BASE_URL}/stores/${storeId}/sale_statuses`),
      getFromSaipos("desc_store_sale_status", "Cancelados", "id_store_sale_status", `${API_BASE_URL}/stores/${storeId}/sale_statuses`)
    ])

    const statuses = {
      delivery: [
        { desc: "Cozinha", order: 0, types: [1, 5, 6], statusId: firstSlSt },
        { desc: "Saiu para entrega", order: 1, types: [3], statusId: secondSlSt },
        { desc: "Entregue", order: 2, types: [5, 26], statusId: thirdSlSt },
        { desc: "Cancelados", order: 3, types: [4], statusId: 0 }
      ],
      easyDelivery: [
        { desc: "Cozinha", order: 0, types: [1, 5, 6, 21], statusId: firstSlSt },
        { desc: "Aguardando entrega", order: 1, types: [2, 21], statusId: secondSlSt },
        { desc: "Saiu para entrega", order: 2, types: [3, 20], statusId: thirdSlSt },
        { desc: "Entregue", order: 3, types: [5, 26], statusId: 0 },
        { desc: "Cancelados", order: 4, types: [4], statusId: 0 }
      ]
    }

    const key = chosenData.delivery ? 'delivery' : 'easyDelivery'

    for (const status of statuses[key]) {
      await updateSaleStatus({
        id_store_sale_status: status.statusId,
        desc_store_sale_status: status.desc,
        order: status.order,
        types: status.types
      })
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de STATUS DE VENDA', error)
    return ["STATUS DE VENDA: ", { stack: error.stack }]
  }
}

module.exports = saleStatus
