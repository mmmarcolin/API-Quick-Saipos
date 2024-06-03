import { storeId } from "./../../../config/variables.js"

export class Cest {
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
        this.taxes_data_cfop = [{
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
        }]
    }
}
