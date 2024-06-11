// Imports
import { getEnvVar } from "./../../config/variables.js";

export async function getContactId(hubspotTicketId) {
    try {   
        //  Perform request
        const responseContact = await fetch(`https://api.hubapi.com/crm/v4/objects/tickets/${hubspotTicketId}/associations/contact`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvVar().HUBSPOT_TOKEN}`
            }
        })
        const responseContactId = await responseContact.json()
        const results = responseContactId.results[0]?.toObjectId

        // Results handling
        console.log("getContactId: " + JSON.stringify(results));
        if (results) return results;
        return("ID Hubspot não encontrado.");
    } catch (error) {
        console.error("Error getting contact Id", error)
        throw error
    }
}