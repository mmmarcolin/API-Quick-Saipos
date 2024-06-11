// Imports
import { $ } from "./../../main.js";

// Request to get Hubspot data
export async function requestHubspotData(storeId) {
    try {
        // Perform the fetch operation with necessary options
        const response = await fetch(
            `http://localhost:3000/dev/hubspot-data`, { 
            method: "POST", 
            headers: { 
                Authorization: API_TOKEN,
                "Content-Type": "application/json"
            },  
            body: JSON.stringify({
                saipos_token: $("saipos-auth-token").value.trim(),
                store_id: storeId
            }),
        });
        const results = await response.json()

        // Return handling
        if (results) return { data: results?.data, message: results.message, status: results.status}
        throw new Error("Erro ao conectar QuickAPI.")
    } catch (error) {
        throw error;
    }
}