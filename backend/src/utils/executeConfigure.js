// Imports
import { formatDate } from "./formatDate.js"
import { choices } from "./../api/saipos/modules/choices.js";
import { deliveryAreas } from "./../api/saipos/modules/deliveryAreas.js";
import { deliveryMen } from "./../api/saipos/modules/deliveryMen.js";
import { ifoodIntegration } from "./../api/saipos/modules/ifoodIntegration.js";
import { menu } from "./../api/saipos/modules/menu.js";
import { orderCard } from "./../api/saipos/modules/orderCard.js";
import { partners } from "./../api/saipos/modules/partners.js";
import { paymentTypes } from "./../api/saipos/modules/paymentTypes.js";
import { saleStatus } from "./../api/saipos/modules/saleStatus.js";
import { settings } from "./../api/saipos/modules/settings.js";
import { shifts } from "./../api/saipos/modules/shifts.js";
import { storeData } from "./../api/saipos/modules/storeData.js";
import { tableOrder } from "./../api/saipos/modules/tableOrder.js";
import { users } from "./../api/saipos/modules/users.js";
import { waiters } from "./../api/saipos/modules/waiters.js";
import { checkTruthyValue } from "./checkTruthyValue.js";

// Functions object
const moduleResults = {};
const func = {
    ifoodIntegration, saleStatus, tableOrder, 
    orderCard, settings, storeData, 
    shifts, waiters, deliveryMen, 
    users, deliveryAreas, choices, 
    menu, paymentTypes, partners
};

// Function to execute configure
export async function executeConfigure(quickData) {
    try {
        // Variables initialization
        const startTime = new Date();
        
        // Initial and Final modules
        const initialModules = ["ifoodIntegration", "paymentTypes", "storeData", "choices", "settings"];
        const finalModules = ["saleStatus", "tableOrder", "orderCard", "shifts", "waiters", "deliveryMen", "users", "deliveryAreas", "menu", "partners"];

        // Execute and collect results for both initial and final modules
        await executeModules(initialModules, quickData);
        await executeModules(finalModules, quickData);

        // Finish time variables
        const endTime = new Date();
        quickData.generalData.time.delta = parseFloat((endTime - startTime) / 1000).toFixed(0);
        quickData.generalData.time.timestamp = await formatDate(endTime)    

        // Results handling
        console.log("createFinalReport: " + JSON.stringify(quickData, moduleResults));
        if (quickData && moduleResults) return { quickData, moduleResults };
        throw new Error("Error executing configure");
    } catch (error) {
        console.error("Error executing configure", error);
        throw error;
    }
}

// Function to execute a list of modules and update results
async function executeModules(modules, quickData) {
    const responses = await Promise.all(
        modules.map(moduleName => executeModule(moduleName, quickData))
    );
    
    modules.forEach((moduleName, index) => {
        moduleResults[moduleName] = responses[index];
    });
}

// Execute each module
async function executeModule(moduleName, quickData) {
    let moduleError
    if (await checkTruthyValue(quickData[`${moduleName}Chosen`]))
        moduleError = await func[moduleName](quickData[`${moduleName}Chosen`]);

    return !moduleError 
        ? "NÃO EXECUTADO" 
        : moduleError.length === 0 
            ? "SUCESSO" : 
            "POSSÍVEL FALHA";
}
