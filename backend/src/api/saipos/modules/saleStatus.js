import { SaleStatus } from "./../Classes/saleStatus.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function saleStatus(quickData) {
    const operations = []
    const everyResults = []
    
    async function getSaleStatusId(value) {
        return await fetchSaipos({
            method: "GET",
            byEndpoint: "sale_statuses",
            findValue: value,
            atKey: "desc_store_sale_status",
            andReturn: "id_store_sale_status"
        })
    }

    try {
        const saleStatusId = await Promise.all([
            getSaleStatusId("Cozinha"),
            getSaleStatusId("Entregue"),
            getSaleStatusId("Cancelados")
        ])
        everyResults.push(...saleStatusId)

        const statuses = {
            delivery: [
                { desc: "Cozinha", order: 0, types: [1, 5, 6], statusId: saleStatusId[0] },
                { desc: "Saiu para entrega", order: 1, types: [3], statusId: saleStatusId[1] },
                { desc: "Entregue", order: 2, types: [5, 26], statusId: saleStatusId[2] },
                { desc: "Cancelados", order: 3, types: [4], statusId: 0 }
            ],
            easyDelivery: [
                { desc: "Cozinha", order: 0, types: [1, 5, 6, 21], statusId: saleStatusId[0] },
                { desc: "Aguardando entrega", order: 1, types: [2, 21], statusId: saleStatusId[1] },
                { desc: "Saiu para entrega", order: 2, types: [3, 20], statusId: saleStatusId[2] },
                { desc: "Entregue", order: 3, types: [5, 26], statusId: 0 },
                { desc: "Cancelados", order: 4, types: [4], statusId: 0 }
            ]
        }
        
        const key = quickData.delivery ? "delivery" : "easyDelivery"
        for (const status of statuses[key]) {            
            everyResults.push(fetchSaipos({
                method: status.statusId === 0 ? "POST" : "PUT",
                byEndpoint: status.statusId === 0 ? "sale_statuses" : `sale_statuses/update-validate/${status.statusId}`,
                insertData: new SaleStatus({
                    id_store_sale_status: status.statusId,
                    desc_store_sale_status: status.desc,
                    order: status.order,
                    types: status.types
                })
            }));
        }
        
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering sale statuses.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}