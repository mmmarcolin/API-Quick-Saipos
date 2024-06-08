// Function to send a POST request with form data
export async function requestSaiposData(saiposData) {
    try {        
        // Perform the fetch operation with necessary options for a POST request
        const response = await fetch(
            `http://localhost:3000/dev/form-to-quick`, {
            method: "POST", 
            headers: { Authorization: API_TOKEN },  
            body: saiposData 
        });
        const results = await response.json()

        // Return handling
        if (results) return { message: results.message, status: results.status }
        throw new Error("Erro ao conectar QuickAPI.")
    } catch (error) {
        throw error;
    }
}