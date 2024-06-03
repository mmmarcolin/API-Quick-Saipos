import { storeId } from "./../../../config/variables.js"

export class PaymentType {
    constructor(data) {
        this.id_store_payment_type = 0
        this.payment_template = 1
        this.desc_store_payment_type = data.desc_store_payment_type
        this.nfe_cod_bandeira = data.nfe_cod_bandeira
        this.id_payment_method = data.id_payment_method
        this.id_store = storeId
        this.enabled = "Y"
        this.on_the_arm = "N"
        this.order = 1
    }
}