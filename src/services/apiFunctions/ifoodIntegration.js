const { getFromSaipos, postToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Ifood {
  constructor(data) {
    this.id_store_partner_sale = 0,
    this.id_store = storeId,
    this.id_partner_sale = 1,
    this.enabled = "Y",
    this.$edit = true,
    this.full_service_delivery = "Y",
    this.$_cod_store = data._cod_store,
    this.$_desc_store_partner = data._desc_store_partner,
    this.$_enabled = "Y"
  }
}

async function ifoodIntegration(chosenData) {
  try {

    const ifoodToPost = []
    for (const ifoodData of chosenData.storeCode) {
      ifoodToPost.push(new Ifood({
        _cod_store: ifoodData.storeCode,
        _desc_store_partner: ifoodData.storeName
      }))
      await postToSaipos(ifoodToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/verify_partner_sale_api_login`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de IFOOD', error)
    return ["IFOOD: ", { stack: error.stack }]
  }
}

module.exports = ifoodIntegration