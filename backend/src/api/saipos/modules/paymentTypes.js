import { PaymentType } from "./../Classes/PaymentTypes.js";
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function paymentTypes(quickData) {
    const operations = [];
    const everyResults = [];
    
    const paymentMappings = {
        pix: [["Pix", 13, null]],
        elo: [["Crédito Elo", 3, "06"], ["Débito Elo", 4, "06"]],
        master: [["Crédito Mastercard", 3, "02"], ["Débito Mastercard", 4, "02"]],
        visa: [["Crédito Visa", 3, "01"], ["Débito Visa", 4, "01"]],
        amex: [["Crédito American Express", 3, "03"]],
        hiper: [["Crédito Hipercard", 3, "07"]],
        sodexo: [["Vale Alelo", 7, null]],
        alelo: [["Vale Sodexo", 7, null]]
    }

    try {
        for (const key of Object.keys(quickData)) {
            if (!quickData[key]) continue
            
            for (const paymentOption of paymentMappings[key]) {
                const [desc, idMethod, nfeCode] = paymentOption;

                operations.push(fetchSaipos({
                    method: "POST",
                    byEndpoint: "payment_types",
                    insertData: new PaymentType({
                        desc_store_payment_type: desc,
                        nfe_cod_bandeira: nfeCode,
                        id_payment_method: idMethod
                    })
                }))
            }
        }

        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering payment types.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}