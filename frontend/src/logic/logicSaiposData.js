// Imports
import { getFormData } from "./../utils/getFormData.js";
import { $, display } from "./../../main.js";
import { requestSaiposData } from "./../api/requestSaiposData.js";

// Logic of Hubspot integration
export async function logicSaiposData() {
    try {
        // Show loading animation
        display.loading("Realizando cadastro...");
        
        // Return form data and send to API
        const formData = await getFormData();
        const { message, status } = await requestSaiposData(formData);

        // Display result
        if (status === 200) {
            display.success(message);
            window.localStorage.setItem("saiposToken", $("saipos-auth-token").value.trim());
        } else display.error(message);
    } catch (error) {
        display.error(error);
    }
}