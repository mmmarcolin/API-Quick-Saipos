const { getFromSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

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

async function taxesData(chosenData) {
  try {
    
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
    console.error('Ocorreu um erro durante o cadastro de DADOS FISCAIS ', error)
    return  ["DADOS FISCAIS: ", { stack: error.stack }]
  }
}

module.exports = taxesData