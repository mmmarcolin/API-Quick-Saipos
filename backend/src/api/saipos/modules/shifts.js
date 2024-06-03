import { Shift } from "./../Classes/Shift.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function shifts(quickData) {
    const operations = []
    const everyResults = []

    try {
        const shiftId = await fetchSaipos({
            method: "GET",
            byEndpoint: "shifts",
            andReturn: "id_store_shift"
        })
        everyResults.push(shiftId)

        for (let i = 0; i < quickData.length; i++) {        
            operations.push((i === 0 ? fetchSaipos : fetchSaipos)({
                byEndpoint: `shifts/${i === 0 ? shiftId : ""}`,
                insertData: new Shift({
                    id_store_shift: i === 0 ? shiftId : 0,
                    desc_store_shift: quickData[i].desc,
                    starting_time: quickData[i].time,
                    service_charge: quickData[i].serviceFee
                })
            }));
        }
        
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering shifts.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}