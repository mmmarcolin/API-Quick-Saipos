export async function getCompanyId(HUBSPOT_TOKEN, hubspotTicketId) {
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
        const results = responseCompanyId.results[0]?.toObjectId

        // Results handling
        console.log("getCompanyId: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("ID Hubspot inválido.");
    } catch (error) {
        console.error("Error getting Company Id", error)
        throw error
    }
}