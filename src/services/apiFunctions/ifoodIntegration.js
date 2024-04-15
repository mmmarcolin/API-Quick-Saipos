const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class IfoodVerify {
  constructor(data) {
    this.id_store_partner_sale = 0
    this.id_store = data.id_store
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
    this.id_store_partner_sale = 0,
    this.id_store = data.id_store,
    this.id_partner_sale = 1,
    this.$edit = true,
    this.$_cod_store = data._cod_store,
    this.$_desc_store_partner = data._desc_store_partner,
    this.cod_store = data._cod_store,
    this.desc_store_partner = data._desc_store_partner,
    this.api_password = "",
    this.portal_login = "",
    this.import_delivery_fee = "Y"
  }
}

class PartnerEnable {
  constructor(data) {
    this.id_store_partner_sale = 0
    this.enabled = "Y"
    this.id_store = data.id_store
    this.id_partner_sale = 1
  }
}

async function ifoodIntegration(chosenData, storeId) {
  try {

    const enableToPost = new PartnerEnable({ 
      partnerId: 1,
      id_store: storeId
    })
    await postToSaipos(enableToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/enable_partner_sale`)

    const promises = chosenData.map(async data => {
      const ifoodVerifyToPost = new IfoodVerify({
        _cod_store: data.code,
        _desc_store_partner: data.name,
        id_store: storeId
      })
      const ifoodToPost = new Ifood({
        _cod_store: data.code,
        _desc_store_partner: data.name,
        id_store: storeId
      })

      const verifyRes = await postToSaipos(ifoodVerifyToPost, `${API_BASE_URL}/stores/${storeId}/partners_sale/verify_partner_sale_api_login`)
      if (verifyRes.access_token === "SUCCESS") {
        return postToSaipos([ifoodToPost], `${API_BASE_URL}/stores/${storeId}/partners_sale`)
      } else {
        console.error("Verification failed for data:", data)
        return null
      }
    })

    await Promise.all(promises)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de IFOOD', error)
    return ["IFOOD: ", { stack: error.stack }]
  }
}

module.exports = ifoodIntegration