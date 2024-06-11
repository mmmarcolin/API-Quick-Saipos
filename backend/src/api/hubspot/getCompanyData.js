import { getEnvVar } from "./../../config/variables.js";

export async function getCompanyData(hubspotCompanyId) {
    try {
        //  Perform request
        const responseCompany = await fetch(`https://api.hubapi.com/crm/v3/objects/companies/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvVar().HUBSPOT_TOKEN}`
            },
            body: JSON.stringify({
                filterGroups: [{
                    filters: [{
                        "propertyName": "hs_object_id",
                        "operator": "EQ",
                        "value": hubspotCompanyId
                    }]
                }],
                properties: [
                    "estado", 
                    "city", 
                    "bairro", 
                    "address", 
                    "zip", 
                    "endereco_numero", 
                    "endereco_complemento",
                    "cnpj", 
                    "inscricao_estadual", 
                    "cnae", 
                    "id_saipos"
                ],
                limit: 1
            })
        })
        const responseCompanyData = await responseCompany.json()
        const results = responseCompanyData.results[0]?.properties
        
        // Results handling
        console.log("getCompanyData: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("ID Hubspot não encontrado.");
    } catch (error) {
        console.error("Error getting Company Data", error)    
        throw error
    }
}