// Imports
import { $ } from "./../../main.js";

// Function to send a POST request with form data
export async function requestSaiposData(saiposData) {
    try {        
        // Perform the fetch operation with necessary options for a POST request
        const response = await fetch(
            `http://localhost:3000/dev/form-to-quick`, {
            method: "POST", 
            headers: { "Authorization": API_TOKEN },
            body: JSON.stringify({ 
                saipos_token: $("saipos-auth-token").value.trim(),
                saipos_data: saiposData 
            })
        });
        const results = await response.json()

        // Return handling
        return { message: results.message || results.error, status: response.status}
    } catch (error) {
        throw error;
    }
}