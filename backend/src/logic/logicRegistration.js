// Imports
import { createFinalReport } from "./../utils/createFinalReport.js";
import { executeConfigure } from "./../utils/executeConfigure.js";
import { postToGoogleSheetApi } from "../api/googleSheets/postToGoogleSheetApi.js";
import { processHandlers } from "./../handle/processHandlers.js";
import { createSaiposData } from "./../utils/createSaiposData.js";
import { validateData } from "./../validate/validateData.js";
import { setSaiposToken, setStoreId } from "./../config/variables.js";

// Function to handle registration logic
export async function logicRegistration(formData) {
    try {      
        // HandleData and formData to get SaiposData
        setSaiposToken(formData.saiposAuthToken);
        setStoreId(formData.storeId)

        // Handle data
        const handledData = await processHandlers(formData);
        const saiposData = await createSaiposData(formData, handledData);

        // Validating data
        const validationError = await validateData(formData, saiposData, handledData);
        if (validationError.length > 2) 
            return { statusCode: 400, body: { message: validationError, status: "alert" }};

        // Execute, report and log
        const { quickData, moduleResults } = await executeConfigure(saiposData);
        const report = await createFinalReport(quickData, moduleResults);
        const status = report.includes("POSSÍVEIS FALHAS ⚠️") ? "alert" : "success"
        postToGoogleSheetApi({ formData, quickData, report })

        // Return handling
        return { statusCode: 200, body: { message: report, status: status }};
    } catch (error) {
        console.error("Error registering data:", error);
        return { statusCode: 500, body: { message: error.message, status: "error" } }; 
    }
}
