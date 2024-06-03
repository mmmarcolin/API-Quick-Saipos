// Imports
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
const func = {
    ifoodIntegration, saleStatus, tableOrder, 
    orderCard, settings, storeData, 
    shifts, waiters, deliveryMen, 
    users, deliveryAreas, choices, 
    menu, paymentTypes, partners
};

// Function to execute configure
export async function executeConfigure(data) {
    try {
        // Variables initialization
        const moduleResults = {};
        data.generalData.time.startTime = new Date();
        
        // Initial and Final modules
        const initialModules = ["ifoodIntegration", "paymentTypes", "storeData", "choices", "settings"];
        const finalModules = ["saleStatus", "tableOrder", "orderCard", "shifts", "waiters", "deliveryMen", "users", "deliveryAreas", "menu", "partners"];

        // Execute and collect results for both initial and final modules
        await executeModules(initialModules, data, moduleResults);
        await executeModules(finalModules, data, moduleResults);

        // Process results
        return {configData: data, configResults: moduleResults};
    } catch (error) {
        console.error("Error executing configure: ", error);
        throw error;
    }
}

// Function to execute a list of modules and update results
async function executeModules(modules, data, moduleResults) {
    const promises = modules.map(moduleName => executeModule(moduleName, data));
    const results = await Promise.all(promises);
    console.log(results)
    // results.forEach(result => moduleResults[result.moduleName] = result.success);
}

// Execute each module
async function executeModule(moduleName, data) {
    // Actual execution if module should be executed
    if (await checkTruthyValue(data[`${moduleName}Chosen`])) {
        console.log(`EXECUTANDO: ${data.generalData.storeId} | ${moduleName}`);

        const res = await func[moduleName](data[`${moduleName}Chosen`]);
        return res.forEach((r) => console.log({module: moduleName, response: r.response }))
    }
}
