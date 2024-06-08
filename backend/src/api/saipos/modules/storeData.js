import { Cest } from "./../Classes/Cest.js";
import { Cnae } from "./../Classes/Cnae.js";
import { Contigency } from "./../Classes/Contigency.js";
import { StoreData } from "./../Classes/StoreData.js";
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function storeData(quickData) {
    const operations = [];
    const everyResults = [];

    try {
        const [cnae, stateId, originalStoreData] = await Promise.all([
            fetchSaipos({
                method: "GET",
                useSaiposBaseUrl: true,
                byEndpoint: "cnae",
                findValue: quickData.cnae,
                atKey: "cnae",
            }),
            fetchSaipos({
                method: "GET",
                useSaiposBaseUrl: true,
                byEndpoint: "states",
                findValue: quickData.state,
                atKey: "short_desc_state",
                andReturn: "id_state"
            }),
            fetchSaipos({
                method: "GET",
            })
        ])
        everyResults.push(cnae, stateId, originalStoreData)

        const cityId = await fetchSaipos({
            method: "GET",
            useSaiposBaseUrl: true,
            byEndpoint: `cities?filter=%7B%22where%22:%7B%22id_state%22:${stateId}%7D%7D`,
            findValue: quickData.city,
            atKey: "desc_city",
            andReturn: "id_city"
        })
        everyResults.push(cityId)
        
        everyResults.push(await fetchSaipos({
            method: "POST",
            useSaiposBaseUrl: true,
            byEndpoint: "districts/insert-district-list",
            insertData: { 
                id_city: cityId, 
                desc_districts: [quickData.district] 
            }
        }))
        
        const districtId = await fetchSaipos({
            method: "GET",
            useSaiposBaseUrl: true,
            byEndpoint: `districts?filter=%7B%22where%22:%7B%22id_city%22:${cityId}%7D%7D`,
            findValue: quickData.district,
            atKey: "desc_district",
            andReturn: "id_district"
        })
        everyResults.push(districtId)
        
        let fixedIe
        if (stateId == 16) {
            if (/[\d]/.test(quickData.stateReg)) {
                fixedIe = quickData.stateReg.padStart(13, "0")
            }
            const taxesDataId = await fetchSaipos({
                method: "GET",
                byEndpoint: "taxes_datas",
                findValue: "Bebidas",
                atKey: "desc_store_taxes_data",
                andReturn: "id_store_taxes_data"
            })
            everyResults.push(taxesDataId)
            
            const taxesDataCfopId = await fetchSaipos({
                method: "GET",
                byEndpoint: `taxes_datas?filter=%7B%22where%22%3A%7B%22id_store_taxes_data%22%3A${taxesDataId}%7D%2C%22include%22%3A%7B%22relation%22%3A%22taxes_data_cfop%22%7D%7D`,
                findValue: "Bebidas",
                atKey: "desc_store_taxes_data",
                andReturn: "taxes_data_cfop[0].id_store_taxes_data_cfop"
            })
            everyResults.push(taxesDataCfopId)
            console.log("taxesDataCfopId", taxesDataCfopId)

            operations.push(fetchSaipos({
                method: "PUT",
                byEndpoint: `taxes_datas/${taxesDataId}`,
                insertData: new Cest({
                    id_store_taxes_data: taxesDataId,
                    id_store_taxes_data_cfop: taxesDataCfopId,
                })
            }))
        }

        operations.push(fetchSaipos({
            method: "POST",
            byEndpoint: "cnaes/upsertStoreCnaes",
            insertData: [new Cnae(cnae)]
        }))
        operations.push(fetchSaipos({
            method: "PUT",
            byEndpoint: "taxes_profile",
            insertData: new Contigency()
        }))
        operations.push(fetchSaipos({
            method: "PUT",
            insertData: new StoreData({
                cnpj: quickData.cnpj,
                id_district: districtId,
                ie: fixedIe || quickData.stateReg,
                zip_code: quickData.zipCode,
                address: quickData.address,
                address_number: quickData.addressNumber,
                address_complement: quickData.addressComplement,
                delivery_area_option: quickData.deliveryOption,
            }, originalStoreData)
        }))
        
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering store data.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}