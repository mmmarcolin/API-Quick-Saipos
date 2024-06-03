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
    configCol42: "checked",
    configPermissions: "checked",
    configCancelPass: "checked",
    configCancelReason: "checked",
    configKds: "checked",
    configAccAval: "checked",
    saleStatusLeft: "checked",
    saleStatusEasyDelivery: "checked",
    userWaiterApp: "checked",
    userCashier: "checked",
    deliveryAreaDistrict: "checked",
    deliveryAreaRadius: "checked",
    apportionmentProportional: "checked",
    apportionmentBigger: "checked",
    partnersSiteDelivery: "checked",
    partnersCounterPickup: "checked",
    partnersBasicDigitalMenu: "checked",
    partnersPremiumDigitalMenu: "checked",
    partnersInstructionCounter: "checked",
    partnersInstructionWaiter: "checked",
    
    // Value fields
    partnersStartDay: "value",
    partnersEndDay: "value",
    partnersStartTime: "value",
    partnersEndTime: "value",
    partnersMinimumValue: "value",
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
    shiftDesc: "value",
    shiftTime: "value",
    shiftServiceFee: "value",
    waitersQuantity: "value",
    waitersDailyRate: "value",
    deliveryMenQuantity: "value",
    deliveryMenDailyRate: "value",
    partnersIfoodCode: "value",
    partnersIfoodName: "value",
    tableOrders: "value",
    orderCards: "value",
    domain: "value",
    
    // File fields
    menuCsv: "file",
    choicesCsv: "file",
    deliveryAreaCsv: "file",
    storeId: "value"
};

// Retrieve flatted form data
export async function getFormData() {
    try {
        const formData = {};
        for (const [key, type] of Object.entries(fieldMap)) {
            const element = $(camelToKebab(key));
            formData[key] = type === "checked" ? element.checked || "" : 
            type === "file" ? element.files[0] || "" : 
            element.value.trim() || "";
        }
        return formData;
    } catch (error) {
        throw error
    }
}