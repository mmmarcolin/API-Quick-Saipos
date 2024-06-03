import { storeId } from "./../../../config/variables.js"

export class Menu {
    constructor(data) {
        this.url_site = `${data.url_site}.saipos.com`
        this.primary_color = "#000000"
        this.id_store = storeId
        this.id_photo_site_cover = 25
        this.online_order_enabled = data.premiumMenu
    }
}