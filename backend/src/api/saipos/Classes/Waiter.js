import { storeId } from "./../../../config/variables.js"

export class Waiter {
    constructor(data) {
        this.id_store_waiter = 0
        this.desc_store_waiter = data.desc_store_waiter
        this.value_daily = data.value_daily
        this.id_store = parseInt(storeId)
        this.enabled = "Y"
    }
}