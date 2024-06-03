// Imports
import { getCompanyData } from "./../api/hubspot/getCompanyData.js"
import { getCompanyId } from "./../api/hubspot/getCompanyId.js"
import { getTicketData } from "./../api/hubspot/getTicketData.js"
import { createObjectResponse } from "./../utils/createObjectResponse.js"
import { getEnvVar } from "./../config/variables.js"

// Function to handle Hubspot integration logic
export async function logicHubspotIntegration(data) {
    try {
        // Variables initialization
        const { HUBSPOT_TOKEN } = getEnvVar()
        const hubspotTicketId = data.hubspot_id
        console.log("hubspotTicketId: ", hubspotTicketId);
        
        // Hubspot requests
        const hubspotCompanyId = await getCompanyId(HUBSPOT_TOKEN, hubspotTicketId)
        const [hubspotCompanyData, hubspotTicketData] = await Promise.all([
            getCompanyData(HUBSPOT_TOKEN, hubspotCompanyId),
            getTicketData(HUBSPOT_TOKEN, hubspotTicketId)
        ])

        // Organize returning
        const result = await createObjectResponse(hubspotCompanyData, hubspotTicketData)
        const report = "Hubspot integrada com sucesso." 
        console.log("hubspotIntegration: ", result);

        // Return handling
        return { statusCode: 200, body: { data: result, message: report }}; 
    } catch (error) {
        console.error("Error integrating Hubspot:", error);
        return { statusCode: 500, body: { error: error.message } }; 
    }
}