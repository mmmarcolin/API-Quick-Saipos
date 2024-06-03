// Imports
import { getEnvVar } from "./../config/variables.js";

// Validates the authorization token
export function validateAuth(event) {
    
    // Retrieve the expected API key from environment variables
    const expectedAccessToken = getEnvVar().API_TOKEN;
    
    // Extract the Authorization header, supporting both capitalizations
    const authHeader = event.headers.Authorization || event.headers.authorization;
    
    // Validate if the Authorization header is provided
    if (!authHeader) {
        console.error("Authorization header is missing.");
        return false;
    }
    
    // Check if the Authorization header is either the API token or "Bearer" token format
    const isValid = authHeader === expectedAccessToken || authHeader === `Bearer ${expectedAccessToken}`;
    
    if (!isValid)
        console.error("Invalid API token provided.");
    
    return isValid;
}
