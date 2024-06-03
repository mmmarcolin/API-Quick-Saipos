export class Item {
    constructor(data) {
        this.id_store_choice_item = data.id_store_choice_item
        this.desc_store_choice_item = data.desc_store_choice_item
        this.id_store_choice = data.id_store_choice
        this.detail = data.detail
        this.code = data.code
        this.enabled = "Y"
        this.variations = [{
            id_store_choice_item_variation: 0,
            id_store_choice_item: data.id_store_choice_item, 
            id_store_variation: data.id_store_variation,
            aditional_price: data.aditional_price,
            enabled: "Y"
        }]
    }
}