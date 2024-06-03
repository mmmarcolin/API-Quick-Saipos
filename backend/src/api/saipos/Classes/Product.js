import { storeId } from "./../../../config/variables.js"

export class Product {
    constructor(data) {
        this.id_store = storeId
        this.id_store_item = 0
        this.item_type = this.getItemType(data.desc_store_item)
        this.id_store_category_item = data.id_store_category_item
        this.desc_store_item = data.desc_store_item
        this.detail = data.detail
        this.enabled = "Y"
        this.identifier_number = data.identifier_number
        this.available_delivery = "Y"
        this.available_site_delivery = "Y"
        this.available_digital_menu = "Y"
        this.id_store_taxes_data = null
        this.available_table_order = "Y"
        this.print_type = 1
        this.generic_use = "N"
        this.service_charge = "Y"
        this.decimal_quantity = "N"
        this.order = data.order
        this.categories = []
        this.choices = []
        this.availability = []
        this.production_owner = "P"
        this.cod_gtin = null
        this.variations = [{
            id_store_item_variation: 0,
            id_store_item: 0,
            id_store_variation: data.id_store_variation,
            price: data.price,
            order: 0,
            enabled: "Y",
            variation: {
                id_store: storeId,
                id_store_variation: data.id_store_variation,
                desc_store_variation: "Único",
                desc_store_variation_delivery: null,
                generic_use: "N",
                is_unique: "Y"
            },
            ingredients: []
        }]

    }

    getItemType(desc_store_item) {
        const splittedProduct = desc_store_item.split(" ")
        const isPizza = splittedProduct.some(item => auxiliarVar.pizza.includes(item)) && !splittedProduct.some(item => auxiliarVar.foldedPizza.includes(item))
        return isPizza ? "pizza" : "other"
    };
    
    addChoice(data) {
        this.choices.push({ 
            id_store_choice: data.id_store_choice,
            order: data.order,
            id_store_item: 0, 
            id_store_item_choice: 0
        })
    }
}