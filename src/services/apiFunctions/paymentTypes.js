const { postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class PaymentType {
  constructor(data) {
    this.id_store_payment_type = 0
    this.payment_template = 1
    this.desc_store_payment_type = data.desc_store_payment_type
    this.nfe_cod_bandeira = data.nfe_cod_bandeira
    this.id_payment_method = data.id_payment_method
    this.id_store = 33738
    this.enabled = "Y"
    this.on_the_arm = "N"
    this.order = 1
  }
}

async function paymentTypes(chosenData, storeId) {
  try {
    const paymentMappings = {
      pix: [["Pix", 13, null]],
      elo: [["Crédito Elo", 3, "06"], ["Débito Elo", 4, "06"]],
      master: [["Crédito Mastercard", 3, "02"], ["Débito Mastercard", 4, "02"]],
      visa: [["Crédito Visa", 3, "01"], ["Débito Visa", 4, "01"]],
      amex: [["Crédito American Express", 3, "03"]],
      hiper: [["Crédito Hipercard", 3, "07"]]
    }

    for (const key of Object.keys(chosenData, storeId)) {
      if (chosenData[key] && paymentMappings[key]) {
        for (const paymentOption of paymentMappings[key]) {
          const [desc, nfeCode, idMethod] = paymentOption
          const paymentTypeToPost = new PaymentType({
            desc_store_payment_type: desc,
            nfe_cod_bandeira: nfeCode,
            id_payment_method: idMethod
          })
          await postToSaipos(paymentTypeToPost, `${API_BASE_URL}/stores/${storeId}/payment_types`)
        }
      }
    }
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro das FORMAS DE PAGAMENTO', error)
    return  ["FORMAS DE PAGAMENTO: ", { stack: error.stack }]
  }
}

module.exports = paymentTypes