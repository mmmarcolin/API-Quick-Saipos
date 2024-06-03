// Imports
// import { formatToForm } from "./utils/formatToForm.js";
import { validateAuth } from "./validate/validateAuth.js";

// Send response
export const sendResponse = (statusCode, body, contentType = "application/json") => ({
    statusCode,
    headers: { "Content-Type": contentType },
    body: contentType === "application/json" ? JSON.stringify(body) : body
});

// Handle request
export const handleRequest = async (event, validateFieldsFunction, processFunc, font) => {
    try {
        // Setup input variables
        console.log(JSON.stringify(event))
        let data = font === "hub" ? 
            /*await formatToForm(JSON.parse(event.body))*/null : 
            await JSON.parse(event.body)
        
        // Validate authorization
        if (!validateAuth(event)) return sendResponse(401, { error: "Unauthorized API_TOKEN" });

        // Validate request fields
        const validationErrors = validateFieldsFunction(data);
        if (validationErrors) return sendResponse(400, { error: validationErrors });
            
        // Process the request
        const response = await processFunc(data);
        return sendResponse(response.statusCode, response.body)
    } catch (error) {
        console.error("Error processing request:", error);
        return sendResponse(500, { error: "Internal server error" });
    }
};