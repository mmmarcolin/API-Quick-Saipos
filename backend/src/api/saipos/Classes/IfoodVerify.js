import { storeId } from "./../../../config/variables.js"

export class IfoodVerify {
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