import { saiposToken } from "./../config/variables.js"

// Functio to validate Saipos Auth
export async function validateSaiposAuth(id) {
    // Try request to check id and auth
    try {
        const response = await fetch(`https://api.saipos.com/v1/stores/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": saiposToken
            }
        })

        // Return handling
        return response.ok ? false : true
    } catch (error) {
        throw error
    }
}