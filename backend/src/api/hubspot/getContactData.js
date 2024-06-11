// Imports
import { getEnvVar } from "./../../config/variables.js";

export async function getContactData(hubspotContactId) {
    try {
        //  Perform request
        const responseContact = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
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
                        "value": hubspotContactId
                    }]
                }],
                properties: [
                    "phone", 
                ],
                limit: 1
            })
        })
        const responseContactData = await responseContact.json()
        const results = responseContactData.results[0]?.properties
        
        // Results handling
        console.log("getContactData: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("ID Hubspot não encontrado.");
    } catch (error) {
        console.error("Error getting contact Data", error)    
        throw error
    }
}