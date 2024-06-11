// Imports
import { getFormData } from "./../utils/getFormData.js";
import { display } from "./../../main.js";
import { requestSaiposData } from "./../api/requestSaiposData.js";
import { validatedFormData } from "./../utils/validateFormData.js";
import { generalVerify } from "./../utils/generalVerify.js";

// Logic of Hubspot integration
export async function logicSaiposData() {
    // Verify id size and chars
    const { isStoreIdValid, isAuthTokenValid } = await generalVerify()
    if (!isAuthTokenValid || !isStoreIdValid) {
        isStoreIdValid ? display.alert("ID da loja deve possuir 5 dígitos") : null
        isAuthTokenValid ? display.alert("Saipos Token deve possuir 64 caracteres") : null
        return 
    }

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
            const userResponse = await display.question(validationError.data);
            if (userResponse !== "continue") return;
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