export async function getCompanyData(HUBSPOT_TOKEN, hubspotCompanyId) {
    try {
        //  Perform request
        const responseCompany = await fetch(`https://api.hubapi.com/crm/v3/objects/companies/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HUBSPOT_TOKEN}`
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
        throw new Error("Error getting Company Data");
    } catch (error) {
        console.error("Error getting Company Data", error)    
        throw error
    }
}