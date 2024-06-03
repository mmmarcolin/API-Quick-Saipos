import { DeliveryMen } from "./../Classes/DeliveryMen.js";
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function deliveryMen(quickData) {
    const operations = [];
    const everyResults = [];

    try {
        for (const deliveryMenData of quickData) {
            operations.push(fetchSaipos({
                method: "POST",
                byEndpoint: "delivery_men",
                insertData: new DeliveryMen({
                    delivery_man_name: deliveryMenData.desc,
                    value_daily: deliveryMenData.dailyRate,
                    default_delivery_man: quickData.length === 1 ? "Y" : "N"
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