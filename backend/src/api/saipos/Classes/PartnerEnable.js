import { storeId } from "./../../../config/variables.js"

export class PartnerEnable {
    constructor(id_partner_sale) {
        this.id_store_partner_sale = 0
        this.enabled = "Y"
        this.id_store = storeId
        this.id_partner_sale = id_partner_sale
    }
}