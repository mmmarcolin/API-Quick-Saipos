import { storeId } from "./../../../config/variables.js"

export class Cnae {
    constructor(data) {
        this.id_store_cnae = 0
        this.id_store = storeId
        this.id_cnae = data.id_cnae
        this.default = "Y"
        this.cnae = {
            cnae: data.cnae,
            desc_cnae_display: `${data.cnae} - ${data.desc_cnae}`,
            desc_cnae: data.desc_cnae,
            enabled: "Y",
            id_cnae: data.id_cnae,
        }
    }
}