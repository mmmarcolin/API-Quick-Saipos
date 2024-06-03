import { storeId } from "./../../../config/variables.js"

export class Shift {
    constructor(data) {
        this.id_store_shift = data.id_store_shift,
        this.desc_store_shift = data.desc_store_shift,
        this.starting_time = data.starting_time.replace(/(\d{2})(\d{2})/, "$1:$2"),
        this.use_service_charge = data.service_charge > 0 ? "Y" : "N",
        this.service_charge = data.service_charge, 
        this.discount_payment_rate = "N",
        this.id_store = storeId
    }
}