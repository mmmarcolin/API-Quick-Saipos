export async function getCompanyId(hubspotTicketId) {
    try {   
        //  Perform request
        const responseCompany = await fetch(`https://api.hubapi.com/crm/v4/objects/tickets/${hubspotTicketId}/associations/company`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HUBSPOT_TOKEN}`
            }
        })
        const responseCompanyId = await responseCompany.json()

        // Error handling
        const results = responseCompanyId.results[responseCompanyId.results.length - 1]?.toObjectId

        // Results handling
        console.log("getCompanyId: " + JSON.stringify(results));
        if (results) return results;
        return("ID Hubspot não encontrado.");
    } catch (error) {
        console.error("Error getting Company Id", error)
        throw error
    }
}