import { DataDistrict } from "./../Classes/DataDistrict.js";
import { getFromZipAPI } from "./../../cep/getFromZipApi.js"
import { fetchSaipos } from "./../requestsToSaipos.js"
import { StoreDistrict } from "./../Classes/StoreDistrict.js";

export async function deliveryAreas(quickData) {
    const operations = [];
    const everyResults = [];
    
    try {
        const stateId = await fetchSaipos({
            method: "GET",
            useSaiposBaseUrl: true,
            byEndpoint: "states",
            findValue: quickData.state,
            atKey: "short_desc_state",
            andReturn: "id_state"
        })
        everyResults.push(stateId)

        const cityId = await fetchSaipos({
            method: "GET",
            useSaiposBaseUrl: true,
            byEndpoint: `cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`,
            findValue: quickData.city,
            atKey: "desc_city",
            andReturn: "id_city"
        })
        everyResults.push(cityId)

        let storeData = await fetchSaipos({
            method: "GET"
        })
        everyResults.push(storeData)

        if (quickData.deliveryOption == "A") {
            // everyResults.push(await getFromZipAPI(storeData.zip_code))
            
            // storeData.delivery_area_option = "A"
            // everyResults.push(await fetchSaipos({
            //     method: "PUT",
            //     insertData: storeData
            // }))

            // const areaToPost = new Area({
            //     coordinates: storeData.lat_lng.split(",").map(Number),
            //     id_city: cityId,
            // })
            // quickData.data.forEach(deliveryArea => {
            //     areaToPost.addRadius({
            //         radius: deliveryArea.deliveryArea,
            //         value_motoboy: deliveryArea.deliveryMenFee,
            //         delivery_fee: deliveryArea.deliveryFee
            //     })
            // })
            
            // everyResults.push(await fetchSaipos({
            //     method: "POST",
            //     byEndpoint: "districts/area",
            //     insertData: areaToPost
            // }))

            // const areaId = await fetchSaipos({
            //     method: "GET",
            //     byEndpoint: "districts/area",
            //     andReturn: "id_store_district"
            // })
            // everyResults.push(areaId)

            // everyResults.push(await fetchSaipos({
            //     method: "DELETE",
            //     byEndpoint: `districts/area/${areaId}`,
            // }))
        } else {
            storeData.delivery_area_option = "D"
            everyResults.push(await fetchSaipos({
                method: "PUT",
                insertData: storeData
            }))
            
            everyResults.push(await fetchSaipos({
                method: "POST",
                useSaiposBaseUrl: true,
                byEndpoint: "districts/insert-district-list",
                insertData: new DataDistrict({ 
                    id_city: cityId,
                    desc_districts: quickData.data.map(item => item.deliveryArea)
                })
            }))

            const districtPromises = quickData.data.map(deliveryArea =>
                fetchSaipos({
                    method: "GET",
                    useSaiposBaseUrl: true,
                    byEndpoint: `districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`,
                    findValue: deliveryArea.deliveryArea,
                    atKey: "desc_district",
                    andReturn: "id_district"
                })
            )
            const districtIds = await Promise.all(districtPromises)
            everyResults.push(...districtIds)
            let districtsBatch = []
            
            districtIds.forEach((districtId, index) => {
                districtsBatch.push(new StoreDistrict({
                    id_district: districtId,
                    desc_store_district: quickData.data[index].deliveryArea,
                    delivery_fee: quickData.data[index].deliveryFee,
                    value_motoboy: quickData.data[index].deliveryMenFee
                }))
                
                if (districtsBatch.length === 50 || index === districtIds.length - 1) {
                    operations.push(fetchSaipos({
                        method: "POST",
                        byEndpoint: "districts",
                        insertData: [...districtsBatch]
                    }))
                    districtsBatch = []
                }
            })
        }

        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering delivery areas.", error)
    } finally {
        // console.log(everyResults)
        return everyResults.filter(result => result.error)
    }
}