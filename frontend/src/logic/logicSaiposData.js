// Imports
import { getFormData } from "./../utils/getFormData.js";
import { display } from "./../../main.js";
import { requestSaiposData } from "./../api/requestSaiposData.js";
import { validatedFormData } from "./../utils/validateFormData.js";

// Logic of Hubspot integration
export async function logicSaiposData() {
    try {
        // Check disable button
        if (this.disabled) return;
        this.disabled = true;

        // Show loading animation
        display.loading("Realizando cadastro...");
        
        // Return form data and send to API
        const formData = await getFormData();

        // Error validation
        const validationError = await validatedFormData(formData);
        if (validationError) {
            switch (validationError.status) {
                case "alert":
                    display.alert(validationError.data)
                    return
                case "info":
                    const userResponse = await display.info(validationError.data)
                    if (userResponse === "abort") return
                    display.loading("Realizando cadastro...");
                default:
                    break;
            }
        } 

        // Send data to API
        const { message, status } = await requestSaiposData(formData);

        // Display result
        if (status !== "error") {
            window.localStorage.setItem("saiposToken", formData.get("saiposAuthToken"));
            return display[status](message)
        }
        throw new Error(message)
    } catch (error) {
        display.error(error.message);
    } finally {
        // Re-enable the button after the cooldown period
        setTimeout(() => { this.disabled = false }, 1000);
    }
}