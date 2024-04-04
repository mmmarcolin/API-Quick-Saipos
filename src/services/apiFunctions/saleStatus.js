const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

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

async function saleStatus(chosenData) {
  try {
    const saleStatusIds = [
      await getFromSaipos("order", 1, "id_store_sale_status", `${API_BASE_URL}/stores/${storeId}/sale_statuses`),
      await getFromSaipos("order", 2, "id_store_sale_status", `${API_BASE_URL}/stores/${storeId}/sale_statuses`),
      await getFromSaipos("order", 3, "id_store_sale_status", `${API_BASE_URL}/stores/${storeId}/sale_statuses`)
    ]

    const statuses = {
      delivery: [
        { desc: "Cozinha", order: 0, types: [1, 5, 6], statusId: saleStatusIds[0] },
        { desc: "Saiu para entrega", order: 1, types: [3], statusId: saleStatusIds[1] },
        { desc: "Entregue", order: 2, types: [5], statusId: saleStatusIds[2] },
        { desc: "Cancelado", order: 99, types: [4], statusId: 0 }
      ],
      easyDelivery: [
        { desc: "Cozinha", order: 0, types: [1, 5, 6, 21], statusId: saleStatusIds[0] },
        { desc: "Aguardando entrega", order: 1, types: [2, 21], statusId: saleStatusIds[1] },
        { desc: "Saiu para entrega", order: 2, types: [5, 20], statusId: saleStatusIds[2] },
        { desc: "Entregue", order: 99, types: [5], statusId: 0 },
        { desc: "Cancelado", order: 99, types: [4], statusId: 0 }
      ]
    }

    const key = chosenData.delivery ? 'delivery' : 'easyDelivery'

    for (const status of statuses[key]) {
      await updateSaleStatus({
        id_store_sale_status: status.statusId,
        desc_store_sale_status: status.desc,
        order: status.order,
        types: status.types.map(type => ({ id_sale_status_type: type }))
      })
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de STATUS DE VENDA', error)
    return ["STATUS DE VENDA: ", { stack: error.stack }]
  }
}

module.exports = saleStatus