import { Waiter } from "./../Classes/Waiter.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function waiters(quickData) {
    const operations = [];
    const everyResults = [];

    try {
        for (const waiterData of quickData) {
            operations.push(fetchSaipos({
                method: "POST",
                byEndpoint: "store_waiters",
                insertData: new Waiter ({
                    desc_store_waiter: waiterData.desc,
                    value_daily: waiterData.dailyRate
                })
            }))
        }
        
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering delivery men.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}