export class StoreDistrict {
    constructor(data) {
        this.id_store_district = 0
        this.id_district = data.id_district
        this.desc_store_district = data.desc_store_district
        this.delivery_fee = parseFloat(data.delivery_fee)
        this.value_motoboy = parseFloat(data.value_motoboy)
        this.enabled_site_delivery = "Y"
    }
}