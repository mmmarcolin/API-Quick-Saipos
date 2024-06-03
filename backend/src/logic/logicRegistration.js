// Imports
import { createFinalReport } from "./../utils/createFinalReport.js";
import { executeConfigure } from "./../utils/executeConfigure.js";
import { postToGoogleSheet } from "./../utils/postToGoogleSheet.js";
import { processHandlers } from "./../handle/processHandlers.js";
import { createSaiposData } from "./../utils/createSaiposData.js";
import { validateData } from "./../validate/validateData.js";
import { setSaiposToken, setStoreId } from "./../config/variables.js";

// Function to handle registration logic
export async function logicRegistration(data) {
    try {      
        // HandleData and formData to get SaiposData
        const formData = data.saipos_data;
        const saiposToken = data.saipos_token;
        setSaiposToken(saiposToken);
        setStoreId(data.saipos_data.storeId)

        // Handle data
        const handledData = await processHandlers(formData);
        const saiposData = await createSaiposData(formData, handledData);
        
        // Data logs
        console.log("formData: ", JSON.stringify(formData));
        console.log("handledData: ", JSON.stringify(handledData));
        console.log("saiposData: ", JSON.stringify(saiposData));

        // Validating data
        const validationError = await validateData(formData, saiposData, handledData);
        if (validationError.length > 0)
            return { statusCode: 402, body: { error: validationError }};

        // Execute, report and log
        const { configData, configResults } = await executeConfigure(saiposData);
        const [report] = await Promise.all([
            createFinalReport(configData, configResults),
            postToGoogleSheet(configData)
        ]);

        // Return handling
        return { statusCode: 200, body: { message: report }};
    } catch (error) {
        console.error("Error registering data:", error);
        return { statusCode: 500, body: { error: error.message } }; 
    }
}
