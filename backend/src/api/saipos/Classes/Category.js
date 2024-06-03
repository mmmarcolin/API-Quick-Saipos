export class Category {
    constructor(data) {
        this.desc_store_category_item = data.desc_store_category_item
        this.id_store_taxes_data = data.id_store_taxes_data
        this.print_type = data.print_type
        this.enabled = "Y"
        this.id_store_category_item = 0
        this.order = data.order
        this.average_preparation_time = 20
        this.background_color = null
        this.id_store_item_required = null
    }
}