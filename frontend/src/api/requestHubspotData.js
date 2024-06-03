// Imports
import { $ } from "./../../main.js";

// Request to get hubspot data
export async function requestHubspotData(hubspotId) {
    try {
        // Perform the fetch operation with necessary options
        const response = await fetch(
            `http://localhost:3000/dev/hubspot-data`, { 
            method: "POST", 
            headers: { Authorization: API_TOKEN },  
            body: JSON.stringify({
                saipos_token: $("saipos-auth-token").value.trim(),
                hubspot_id: hubspotId
            }),
        });
        const results = await response.json()
        
        // Return handling
        return { data: results.data, message: results.message || results.error, status: response.status}
    } catch (error) {
        throw error;
    }
}