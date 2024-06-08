// Imports
import { display } from "./../../main.js";
import { insertHubspotData } from "./../utils/insertHubspotData.js";
import { requestHubspotData } from "./../api/requestHubspotData.js";

// Logic of Hubspot integration
export async function logicHubspotData() {
    // Verify id size and chars
    const storeId = $("store-id").value.trim
    if (storeId.length !== 0 || !/^\d+$/.test(storeId)) 
        return display.alert("ID da loja deve possuir 5 dígitos.")
    
    try {
        // Show loading animation
        display.loading("Buscando Ticket...")

        // Send the variables to the API and get response
        const { data, message, status } = await requestHubspotData(storeId)

        // Display result
        status === "success" ? insertHubspotData(data) : null
        display[status](message)
    } catch (error) {
        display.error(error.message);
    }
}