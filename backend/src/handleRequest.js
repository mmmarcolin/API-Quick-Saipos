// Imports
import { performEventData } from "./utils/performEventData.js";
import { validateAuth } from "./validate/validateAuth.js";

// Send response helper function
export const sendResponse = (statusCode, body, contentType = "application/json") => ({
    statusCode,
    headers: { "Content-Type": contentType },
    body: contentType === "application/json" ? JSON.stringify(body) : body
});

// Handle request function
export const handleRequest = async (event, validateFieldsFunction, processFunc) => {
    try {
        // Handle request data
        const requestData = await performEventData(event);
        if (!requestData) 
            return sendResponse(415, { error: "Unsupported Media Type" });
        
        // Event log
        console.log("request:", JSON.stringify(event))
        console.log("requestData:", JSON.stringify(requestData))

        // Validate request authentication
        if (!validateAuth(event)) 
            return sendResponse(401, { error: "Unauthorized API_TOKEN" });

        // Validate request fields
        const validationErrors = validateFieldsFunction(requestData);
        if (validationErrors) 
            return sendResponse(400, { error: validationErrors });

        // Execute and return 
        const response = await processFunc(requestData);
        return sendResponse(response.statusCode, response.body);
    } catch (error) {
        console.error("Error processing request:", error);
        return sendResponse(500, { error: "Internal server error" });
    }
};
