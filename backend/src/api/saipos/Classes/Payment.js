export class Payment {
    constructor() {
        this.upsert = []
    }
    
    addPayment(data) {
        this.upsert.push({
            id_store_payment_type: data.id_store_payment_type,
            id_payment_type: data.id_payment_type,
            new: true
        })
    }
}
