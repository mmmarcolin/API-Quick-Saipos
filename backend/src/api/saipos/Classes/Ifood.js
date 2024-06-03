import { storeId } from "./../../../config/variables.js";

export class Ifood {
    constructor(data) {
        this.id_store_partner_sale = 0,
        this.id_store = storeId,
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