// Imports
import { getCompanyData } from "./../api/hubspot/getCompanyData.js"
import { getCompanyId } from "./../api/hubspot/getCompanyId.js"
import { getTicketData } from "./../api/hubspot/getTicketData.js"
import { createObjectResponse } from "./../utils/createObjectResponse.js"
import { getContactId } from "./../api/hubspot/getContactId.js"
import { getContactData } from "./../api/hubspot/getContactData.js"

// Function to handle Hubspot integration logic
export async function logicHubspotIntegration(data) {
    try {
        // Get associated company
        const hubspotTicketData = await getTicketData(data.store_id)
        
        const [hubspotCompanyId, hubspotContactId] = await Promise.all([
            getCompanyId(hubspotTicketData.hs_object_id),
            getContactId(hubspotTicketData.hs_object_id),
        ])

        // Get Hubspot data
        const [hubspotCompanyData, hubspotContactData] = await Promise.all([
            getCompanyData(hubspotCompanyId),
            getContactData(hubspotContactId),
        ])

        // Organize returning
        const result = await createObjectResponse(hubspotCompanyData, hubspotTicketData, hubspotContactData)
        const report = "Hubspot integrada com sucesso." 

        // Return handling
        return { statusCode: 200, body: { data: result, message: report, status: "success" }}; 
    } catch (error) {
        console.error("Error integrating Hubspot:", error);
        return { statusCode: 500, body: { message: error.message, status: "error" } }; 
    }
}