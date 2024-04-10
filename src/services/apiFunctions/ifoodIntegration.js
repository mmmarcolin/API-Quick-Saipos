const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")
const { storeId } = require('../executeConfigure.js')

class IfoodVerify {
  constructor(data) {
    this.id_store_partner_sale = 0
    this.id_store = storeId
    this.id_partner_sale = 1
    this.enabled = "Y"
    this.$edit = true
    this.full_service_delivery = "Y"
    this.$_cod_store = data._cod_store
    this.$_desc_store_partner = data._desc_store_partner
    this.$_enabled = "Y"
  }
}

class Ifood {
  constructor(data) {
    this.idStorePartnerSale = 0
    this.codStore = data._cod_store
    this.apiLogin = null
    this.apiPassword = ""
    this.apiToken = null
    this.portalLogin = null
    this.portalPassword = null
    this.autoConfirm = "Y"
    this.enabled = "Y"
    this.integrationType = null
    this.descStorePartner = data._desc_store_partner
    this.defaultStorePayment = 0
    this.isOnline =  "N"
    this.timeToPickup =  "0"
    this.timeToDelivery =  "0"
    this.deletedAt = null
    this.importDeliveryFee = "Y"
    this.partnerCredentialType = null
    this.idStore = storeId
    this.idPartnerSale = 1
    this.edit = true
    this._codStore = data._cod_store
    this._descStorePartner = data._desc_store_partner
    this._enabled = "Y"
    this._apiLogin = null
    this._apiPassword = ""
    this._portalLogin = ""
    this._portalPassword = null
  }
}

async function ifoodIntegration(chosenData) {
  console.log(chosenData)
  try {
    const ifoodVerifyToPost = new IfoodVerify ({
      _cod_store: chosenData.code,
      _desc_store_partner: chosenData.name
    })

    const ifoodToPost = new Ifood ({
      _cod_store: chosenData.code,
      _desc_store_partner: chosenData.name
    })

    const verifyRes = await postToSaipos(ifoodVerifyToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/verify_partner_sale_api_login`)
    verifyRes.access_token == "SUCCESS" ? postToSaipos(ifoodToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale`) : null

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de IFOOD', error)
    return ["IFOOD: ", { stack: error.stack }]
  }
}

module.exports = ifoodIntegration