import { storeId } from "./../../../config/variables.js"

export class Site {
    constructor(data) {
        this.pickup_counter = data.pickup_counter ? "Y" : "N"
        this.pickup_delivery = data.pickup_delivery ? "Y" : "N"
        this.url_site = `${data.url_site}.saipos.com`
        this.primary_color = data.primary_color
        this.address_config = 2
        this.minimum_value = data.minimum_value
        this.id_store = storeId
        this.id_photo_site_cover = 25
        this.id_photo_site_background = 71
        this.config_type = "sitedelivery"
    }
}