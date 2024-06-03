import { OrderCard } from "./../Classes/OrderCard.js";
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function orderCard(quickData) {
    const operations = [];
    const everyResults = [];
    const totalQuantity = quickData.quantity
    const batchSize = 50

    try {
        for (let i = 0; i < totalQuantity; i += batchSize) {
            const batchQuantity = Math.min(batchSize, totalQuantity - i);

            operations.push(fetchSaipos({
                method: "POST",
                byEndpoint: "order_cards/insert-order-card-qtt",
                insertData: new OrderCard({
                    qtd: batchQuantity
                })
            }))
        }
        
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering order card.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}