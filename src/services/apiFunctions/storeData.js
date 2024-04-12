const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { API_BASE_URL, normalizeText } = require("../../utils/auxiliarVariables.js")

class Cnae {
  constructor(data) {
    this.id_store_cnae = 0
    this.id_store = data.id_store
    this.id_cnae = data.id_cnae
    this.default = "Y"
    this.cnae = {
      cnae: data.cnae,
      desc_cnae_display: `${data.cnae} - ${data.desc_cnae}`,
      desc_cnae: data.desc_cnae,
      enabled: "Y",
      id_cnae: data.id_cnae,
    }
  }
}

class StoreData {
  constructor(data) {
    this.id_store = data.id_store
    this.corporate_name = data.corporate_name
    this.trade_name = data.trade_name
    this.phone_1 = data.phone_1
    this.phone_2 = data.phone_2
    this.lat_lng = data.lat_lng
    this.cnpj = data.cnpj
    this.ie = data.ie
    this.id_district = data.id_district
    this.zip_code = data.zip_code
    this.address = data.address
    this.address_number = data.address_number
    this.address_complement = data.address_complement
    this.delivery_area_option = data.delivery_area_option
    this.delivery_order =  "Y"
    this.delivery_time = 60
    this.pickup_time = 30
    this.table_order =  "Y"
    this.ticket_order =  "Y"
    this.inventory_control =  "Y"
    this.franchise_dashboard_enabled =  "Y"
    this.id_store_situation = 1
    this.use_chatbot = "N"
    this.printer_tester = "N"
    this.automatically_migrate_sales = "Y"
  }
}

class Cest {
    constructor(data) {
      this.id_store_taxes_data = data.id_store_taxes_data
      this.desc_store_taxes_data = "Bebidas"
      this.enabled = "Y"
      this.ean = null
      this.icms_percentual_base = 100
      this.icms_percentual = 0
      this.icms_fcp_percentual = 0
      this.icms_st_percentual_base = 100
      this.icms_st_percentual = 0
      this.icms_st_fcp_percentual = 0
      this.icms_efetivo_percentual_base = 100
      this.icms_efetivo_percentual = 0
      this.icms_st_mva = 0
      this.ipi_percentual = 0
      this.pis_percentual = 0
      this.cofins_percentual = 0
      this.produzido_em_escala = "S"
      this.cnpj_fabricante = null
      this.cod_beneficio_fiscal = null
      this.id_store = data.id_store
      this.id_origem_mercadoria = 1
      this.id_ncm = 2
      this.cod_icms_desoneracao = null
      this.id_modalidade_base_icms = 2
      this.id_modalidade_base_icms_st = 6
      this.id_cest = 159
      this.taxes_data_cfop = [
        {
          id_store_taxes_data_cfop: data.id_store_taxes_data_cfop,
          id_store_taxes_data: data.id_store_taxes_data,
          id_cfop: 3,
          id_cst_icms: null,
          id_csosn: 9,
          id_cst_ipi: 11,
          id_cst_pis: 7,
          id_cst_cofins: 7,
          cfop: {
            id_cfop: 3,
            cfop: "5405",
            desc_cfop: "Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária, na condição de contribuinte substituído",
            enabled: "Y",
            cfop_display: "5.405",
            desc_cfop_display: "5.405 - Venda de mercadoria adquirida ou recebida de terceiros em operação com mercadoria sujeita ao regime de substituição tributária, na condição de contribuinte substituído",
            active: true
          },
          active: true
        }
      ]
    }
  }
  
class Contigency {
constructor(data) {
  this.id_store = data.id_store
  this.contingency = "N"
  }
}

async function storeData(chosenData, storeId) {
  try {
    const [cnaeId, cnaeDesc, cnaeNumber, stateId, storeOriginalData] = await Promise.all([
      getFromSaipos("cnae", chosenData.cnae, "id_cnae", `${API_BASE_URL}/cnae`),
      getFromSaipos("cnae", chosenData.cnae, "desc_cnae", `${API_BASE_URL}/cnae`),
      getFromSaipos("cnae", chosenData.cnae, "cnae", `${API_BASE_URL}/cnae`),
      getFromSaipos("short_desc_state", chosenData.state, "id_state", `${API_BASE_URL}/states`),
      getFromSaipos(null, null, null, `${API_BASE_URL}/stores/${storeId}`)
    ])
    
    const cityId = await getFromSaipos("desc_city", chosenData.city, "id_city", `${API_BASE_URL}/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`)
    const districtId = await getFromSaipos("desc_district", chosenData.district, "id_district", `${API_BASE_URL}/districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`)

    let cestToPut, fixedIe
    if (stateId === 16) {
      const taxesDataId = await getFromSaipos("desc_store_taxes_data", "Bebidas", "id_store_taxes_data", `${API_BASE_URL}/stores/${storeId}/taxes_datas`)
      const taxesDataCfopId = await getFromSaipos("desc_store_taxes_data", "Bebidas", "taxes_data_cfop", `${API_BASE_URL}/stores/${storeId}/taxes_datas?filter=%7B%22where%22%3A%7B%22id_store_taxes_data%22%3A${taxesDataId}%7D%2C%22include%22%3A%7B%22relation%22%3A%22taxes_data_cfop%22%7D%7D`, null, "id_store_taxes_data_cfop")

      cestToPut = new Cest({
        id_store_taxes_data: taxesDataId,
        id_store_taxes_data_cfop: taxesDataCfopId,
        id_store: storeId
      })

      if (chosenData.stateReg !== "ISENTO") {
        fixedIe = chosenData.stateReg.padStart(13, "0")
      }

      putToSaipos(cestToPut, `${API_BASE_URL}/stores/${storeId}/taxes_profile/${taxesDataId}`)
    }

    const cnaeToPost = new Cnae({
      id_cnae: cnaeId,
      desc_cnae: cnaeDesc,
      cnae: cnaeNumber,
      id_store: storeId
    })

    const storeDataToPut = new StoreData({
      corporate_name: storeOriginalData.corporate_name,
      trade_name: storeOriginalData.trade_name,
      phone_1: storeOriginalData.phone_1,
      phone_2: storeOriginalData.phone_2,
      lat_lng: storeOriginalData.lat_lng,
      cnpj: normalizeText(chosenData.cnpj),
      id_district: districtId,
      ie: fixedIe || chosenData.stateReg,
      zip_code: normalizeText(chosenData.zipCode),
      address: chosenData.address,
      address_number: chosenData.addressNumber,
      address_complement: chosenData.addressComplement,
      delivery_area_option: chosenData.deliveryOption,
      id_store: storeId
    })

    const contingencyToPut = new Contigency({ id_store: storeId })

    await Promise.all([
      postToSaipos([cnaeToPost], `${API_BASE_URL}/stores/${storeId}/cnaes/upsertStoreCnaes`),
      putToSaipos(storeDataToPut, `${API_BASE_URL}/stores/${storeId}`),
      putToSaipos(contingencyToPut, `${API_BASE_URL}/stores/${storeId}/taxes_profile`)
    ])

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de DADOS DA LOJA', error)
    return  ["DADOS DA LOJA: ", { stack: error.stack }]
  }
}

module.exports = storeData