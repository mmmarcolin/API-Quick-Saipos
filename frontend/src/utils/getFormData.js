// Imports
import { $ } from "./../../main.js";

// Function to convert camelCase to kebab-case
function camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

// Define a mapping of field keys to their expected types
const fieldMap = {
    // Checkbox fields
    paymentTypesPix: "checked",
    paymentTypesMaster: "checked",
    paymentTypesElo: "checked",
    paymentTypesVisa: "checked",
    paymentTypesAmex: "checked",
    paymentTypesHiper: "checked",
    paymentTypesSodexo: "checked",
    paymentTypesAlelo: "checked",
    paymentTypesTicket: "checked",
    settingsCancelPassword: "checked",
    settingsCancelReason: "checked",
    settingsKds: "checked",
    ifoodAutoSending: "checked",
    saleStatusDelivery: "checked",
    saleStatusEasyDelivery: "checked",
    waiterCashier: "checked",
    partnersSaiposBot: "checked",

    // Value fields
    partners: "value",
    partnersImages: "value",
    partnersStartDay: "value",
    partnersEndDay: "value",
    partnersStartTime: "value",
    partnersEndTime: "value",
    partnersMinimumValue: "value",
    partnersPickupMethod: "value",
    storeDataState: "value",
    storeDataCity: "value",
    storeDataDistrict: "value",
    storeDataAddress: "value",
    storeDataNumber: "value",
    storeDataZip: "value",
    storeDataComplement: "value",
    storeDataCnpj: "value",
    storeDataStateRegistration: "value",
    storeDataCnae: "value",
    storeDataPhone: "value",
    shiftDesc: "value",
    shiftTime: "value",
    shiftServiceFee: "value",
    waitersQuantity: "value",
    waitersDailyRate: "value",
    deliveryMenQuantity: "value",
    deliveryMenDailyRate: "value",
    ifoodCode: "value",
    ifoodName: "value",
    ifoodUsername: "value",
    ifoodPassword: "value",
    orderTables: "value",
    orderCards: "value",
    domain: "value",
    apportionmentMethod: "value",
    storeId: "value",
    saiposAuthToken: "value",
    
    // File fields
    menuCsv: "file",
    choicesCsv: "file",
    deliveryAreaCsv: "file",
};


// Retrieve flatted form data
export async function getFormData() {
    try {
        const formData = new FormData();

        // Adiciona manualmente os valores ao FormData
        Object.entries(fieldMap).forEach(([key, type]) => {
            const element = $(camelToKebab(key));
    
            if (type === "checked")
                formData.append(key, element.checked ? "true" : "false");
            else if (type === "file" && element.files.length > 0)
                formData.append(key, element.files[0]);
            else if (type !== "file")
                formData.append(key, element.value.trim() || "");
        });

        return formData;
    } catch (error) {
        throw error
    }
}