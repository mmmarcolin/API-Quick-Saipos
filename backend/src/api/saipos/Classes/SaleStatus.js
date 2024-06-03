import { storeId } from "./../../../config/variables.js"

export class SaleStatus {
    constructor(data) {
        this.id_store_sale_status = data.id_store_sale_status
        this.desc_store_sale_status = data.desc_store_sale_status
        this.order = data.order
        this.emit_sound_alert = "Y"
        this.limit_time_minutes = 30
        this.payment_check = "N"
        this.id_store = storeId
        this.types = data.types
        this.steps = []
    }
}