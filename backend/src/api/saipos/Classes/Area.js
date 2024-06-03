import { storeId } from "./../../../config/variables.js"

export class Area {
    constructor(data) {
        this.type = "Feature"
        this.geometry = {
            type: "Point",
            coordinates: data.coordinates
        }
        this.properties = {
            districts: [],
            custom_layers: [],
            id_store_district: 0,
            order: 0,
            desc_store_district: `Raios da loja ${storeId}`,
            id_city: data.id_city,
            type: "default",
            id: 0,
            style: {
                color: "#4CAF50",
                fillColor: "#4CAF50"
            },
            radius_mode: [],
            id_store: storeId,
            delivery_fee: 0,
            value_motoboy: 0
        }
    }
    
    addRadius(data) {
        this.properties.radius_mode.push({
            radius: parseInt(data.radius),
            value_motoboy: parseInt(data.value_motoboy),
            delivery_fee: parseInt(data.delivery_fee)
        })
    }
}
