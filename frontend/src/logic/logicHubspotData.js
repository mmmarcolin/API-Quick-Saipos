// Imports
import { $, display } from "./../../main.js";
import { insertHubspotData } from "./../utils/insertHubspotData.js";
import { requestHubspotData } from "./../api/requestHubspotData.js";
import { generalVerify } from "./../utils/generalVerify.js";

// Logic of Hubspot integration
export async function logicHubspotData() {
    // Verify id size and chars
    const { isStoreIdValid, isAuthTokenValid } = await generalVerify()
    if (!isAuthTokenValid || !isStoreIdValid) {
        !isStoreIdValid ? display.alert("ID da loja deve possuir 5 dígitos") : 
        !isAuthTokenValid ? display.alert("Saipos Token deve possuir 64 caracteres") : null
        return 
    }

    try {
        // Check disable button
        if (this.disabled) return;
        this.disabled = true;
        
        // Show loading animation
        display.loading("Buscando Ticket...")

        // Send the variables to the API and get response
        const { data, message, status } = await requestHubspotData($("store-id").value.trim())

        // Display result
        status === "success" ? insertHubspotData(data) : null
        display[status](message)
    } catch (error) {
        display.error(error.message);
    } finally {
        // Re-enable the button after the cooldown period
        setTimeout(() => { this.disabled = false }, 1000);
    }
}