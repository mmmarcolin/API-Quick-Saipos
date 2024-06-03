// Imports
import { display } from "./../../main.js";
import { insertHubspotData } from "./../utils/insertHubspotData.js";
import { requestHubspotData } from "./../api/requestHubspotData.js";

// Logic of Hubspot integration
export async function logicHubspotData() {
    // Verify id size
    const hubspotId = this.value.trim()
    if (hubspotId.length !== 10) return
    
    try {
        // Show loading animation
        display.loading("Buscando Ticket...")

        // Send the variables to the API and get response
        const { data, message, status } = await requestHubspotData(hubspotId)

        // Display result
        if (status === 200) {
            insertHubspotData(data)
            display.success(message)
        } else display.error(message)
    } catch (error) {
        display.error(error);
    }
}