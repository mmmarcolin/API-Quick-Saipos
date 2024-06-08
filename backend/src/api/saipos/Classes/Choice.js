import { storeId } from "./../../../config/variables.js"
import { Item } from "./Item.js"

export class Choice {
    constructor(data) {
        this.id_store = storeId
        this.id_store_choice = 0
        this.desc_store_choice = data.desc_store_choice
        this.choice_type = data.choice_type
        this.min_choices = data.min_choices
        this.max_choices = data.max_choices
        this.calc_method = data.calc_method
        this.generic_use = "N"
        this.group_items_print = data.group_items_print
        this.choice_items = []
        this.kind = data.kind
    }
    
    addItem(data) {
        this.choice_items.push(new Item(data))
    }
}