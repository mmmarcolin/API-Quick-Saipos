import { storeId } from "./../../../config/variables.js"

export class DeliveryMen {
    constructor(data) {
        this.id_store_delivery_man = 0
        this.delivery_man_name = data.delivery_man_name
        this.value_daily = data.value_daily
        this.id_store = storeId
        this.enabled_partner_delivery = data.delivery_man_name == "Entrega fácil" ? "Y" : "N"
        this.id_partner_delivery = data.delivery_man_name == "Entrega fácil" ? 4 : 0
        this.default_delivery_man = data.default_delivery_man
        this.enabled = "Y"
        this.api_login = ""
        this.partner_store_name = ""
        this.api_password = ""
        this.phone = ""
    }
}