import { storeId } from "./../../../config/variables.js"

export class StoreData {
    constructor(data, original) {
        this.id_store = parseInt(storeId)
        this.corporate_name = original.corporate_name
        this.trade_name = original.trade_name
        this.phone_1 = data.phone
        this.phone_2 = data.phone
        this.cnpj = data.cnpj
        this.ie = data.ie
        this.id_district = data.id_district
        this.zip_code = data.zip_code
        this.address = data.address
        this.address_number = data.address_number
        this.address_complement = data.address_complement
        this.delivery_area_option = data.delivery_area_option
        this.delivery_order =  "Y"
        this.delivery_time = 60
        this.pickup_time = 30
        this.table_order =  "Y"
        this.ticket_order =  "Y"
        this.inventory_control =  "Y"
        this.franchise_dashboard_enabled =  "Y"
        this.id_store_situation = 1
        this.use_chatbot = "N"
        this.printer_tester = "N"
        this.automatically_migrate_sales = "Y"
    }
}