import { TableOrder } from "../Classes/TableOrder.js";
import { fetchSaipos } from "../requestsToSaipos.js"

export async function orderTable(quickData) {
    const operations = [];
    const everyResults = [];
    const totalQuantity = parseInt(quickData.quantity)
    const batchSize = 50

    try {
        for (let i = 0; i < totalQuantity; i += batchSize) {
            const batchQuantity = Math.min(batchSize, totalQuantity - i)

            operations.push(fetchSaipos({
                method: "POST",
                byEndpoint: "tables/insert-table-qtd",
                insertData: new TableOrder({
                    qtd: batchQuantity
                })
            }))
        }

        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering table orders.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}