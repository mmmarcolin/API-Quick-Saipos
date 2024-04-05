const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Cnae {
  constructor(data) {
    this.id_cnae = data.id_cnae
    this.desc_cnae = data.desc_cnae
    this.desc_cnae_display = `${data.cnae} - ${data.desc_cnae}`
    this.enabled = "Y"
    this.cnae = {
        cnae: data.cnae,
        desc_cnae_display: `${data.cnae} - ${data.desc_cnae}`,
        desc_cnae: cnaeDesc,
        enabled: "Y",
        id_cnae: data.id_cnae,
    }
  }
}

class StoreData {
  constructor(data) {
    this.id_store = id_store
    this.created_at = created_at
    this.updated_at = updated_at
    this.corporate_name = corporate_name
    this.trade_name = trade_name
    this.phone_1 = phone_1
    this.phone_2 = phone_2
    this.cnpj = cnpj
    this.ie = ie
    this.zip_code = zip_code
    this.address = address
    this.address_number = address_number
    this.address_complement = address_complement
    this.id_district = id_district
    this.delivery_order = delivery_order
    this.delivery_time = delivery_time
    this.pickup_time = pickup_time
    this.table_order = table_order
    this.ticket_order = ticket_order
    this.inventory_control = inventory_control
    this.franchise_dashboard_enabled = franchise_dashboard_enabled
    this.delivery_area_option = delivery_area_option
    this.id_store_situation = id_store_situation
    this.lat_lng = lat_lng
    this.use_chatbot = use_chatbot
    this.printer_tester = printer_tester
    this.automatically_migrate_sales = automatically_migrate_sales
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
      this.id_store = storeId
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
    this.id_store = storeId
    this.token_nfce = null
    this.token_nfce_id = null
    this.ambiente_nfe = 1
    this.nfe_enabled = "N"
    this.sat_enabled = "N"
    this.sat_signature_software = null
    this.sat_activation_code = null
    this.version_layout_nfe = "4.00"
    this.email = ""
    this.contingency = data.contigency
    this.contingency_date = null
    this.contingency_reason = null
    this.contingency_type_emission = null
    this.nfe_ult_nsu = "0"
    this.nfe_import_auto = "N"
    this.nfe_import_date = null
    this.has_only_own_delivery = "Y"
    this.nfe_complementary_information = null
    this.id_regime_tributario = 1
    this.id_sat_modelo = null
    this.show_import_date = ""
}
}

async function storeData(chosenData) {
  try {

    const cnaeId = await getFromSaipos("cnae", chosenData.cnae, "id_cnae", `${API_BASE_URL}/cnae`)
    const cnaeDesc = await getFromSaipos("cnae", chosenData.cnae, "desc_cnae", `${API_BASE_URL}/cnae`)
    const stateId = await getFromSaipos("desc_state", chosenData.state, "id_state",`${API_BASE_URL}/states`)
    const cityId = await getFromSaipos("desc_city", chosenData.city, "id_city", `${API_BASE_URL}/cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`)

    const cnaeToPost = new Cnae({
        id_cnae: cnaeId,
        desc_cnae: cnaeDesc,
        cnae: chosenData.cnae
    })

    const storeDataToPut = new StoreData({

    })

    await postToSaipos([cnaeToPost], `${API_BASE_URL}/stores/${storeId}/cnaes/upsertStoreCnaes`)
    await putToSaipos(storeDataToPut, `${API_BASE_URL}/stores/${storeId}`)

    if (chosenData.cest) {
        const taxesDataId = await getFromSaipos("desc_store_taxes_data", "Bebidas", "id_store_taxes_data", `${API_BASE_URL}/stores/${storeId}/taxes_datas`)
        const taxesDataCfopId = await getFromSaipos("desc_store_taxes_data", "Bebidas", "taxes_data_cfop.id_store_taxes_data_cfop", `${API_BASE_URL}/stores/${storeId}/taxes_datas?filter=%7B%22where%22%3A%7B%22id_store_taxes_data%22%3A${taxesDataId}%7D%2C%22include%22%3A%7B%22relation%22%3A%22taxes_data_cfop%22%7D%7D`)
        const cestToPut = new Cest ({
            desc_store_taxes_data: taxesDataId,
            id_store_taxes_data_cfop: taxesDataCfopId
        })
        await putToSaipos(cestToPut, `${API_BASE_URL}/stores/${storeId}/taxes_datas/${taxesDataId}`)
    }
  
    if (chosenData.contigency) {
        const contigencyToPut = new Contigency ({
            contingency: "N"
        })
        await putToSaipos(contigencyToPut, `${API_BASE_URL}/stores/${storeId}/taxes_profile`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de DADOS DA LOJA', error)
    return  ["DADOS DA LOJA: ", { stack: error.stack }]
  }
}

module.exports = storeData