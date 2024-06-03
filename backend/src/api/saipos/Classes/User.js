import { normalizeText } from "./../../../config/variables.js"

export class User {
    constructor(data) {
        this.id_user = 0
        this.print_to_user = data.full_name == "Caixa" ? null : data.print_to_user
        this.show_sale_notify = data.full_name == "Caixa" ? "Y" : "N"
        this.password = normalizeText(data.full_name)
        this.user_type = data.full_name == "Caixa" ? 1 : 4
        this.full_name = data.full_name
        this.login = `${normalizeText(data.full_name)}@${normalizeText(data.store_name)}.com`
        this.email = `${normalizeText(data.full_name)}@${normalizeText(data.store_name)}.com`
    }
}