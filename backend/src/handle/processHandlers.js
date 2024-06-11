// Imports
import { handleCSV } from "./handleCSV.js";
import { handleIfood } from "./handleIfood.js";
import { handleShift } from "./handleShift.js";
import { handleWeekDays } from "./handleWeekDays.js";
import { handleWorkers } from "./handleWorkers.js";

// Function to handle and proces handlers
export async function processHandlers(formData) {
    // Return handling
    return {
        menuData: formData.menuCsv ? await handleCSV(formData.menuCsv.data, "card") : "",
        choicesData: formData.choicesCsv ? await handleCSV(formData.choicesCsv.data, "add") : "",
        deliveryAreaData: formData.deliveryAreaCsv ? await handleCSV(formData.deliveryAreaCsv.data, "area") : "",
        deliveryMenData: await handleWorkers(formData.deliveryMenQuantity, formData.deliveryMenDailyRate, "Entregador", formData.saleStatusEasyDelivery),
        usersData: await handleWorkers(formData.waitersQuantity, formData.waitersDailyRate, "Garçom", formData.waiterCashier),
        ifoodData: formData.ifoodCode ? await handleIfood(formData.ifoodCode, formData.ifoodName) : "",
        shiftData: formData.shiftDesc ? await handleShift(formData.shiftDesc, formData.shiftTime, formData.shiftServiceFee) : "",
        weekDaysData: formData.partnersStartDay ? await handleWeekDays(formData.partnersStartDay, formData.partnersEndDay) : "",
        somePartners: formData.partners !== "" || formData.saiposBot,
        someUser: formData.waiterCashier || formData.waitersQuantity.length > 0,
        someIfoodAutoSending: ["ifoodUsername", "ifoodPassword", "ifoodAutoSending"].some(key => formData[key]),
        everyIfoodAutoSending: ["ifoodUsername", "ifoodPassword", "ifoodAutoSending"].every(key => formData[key]),
        someStoreData: ["storeDataCnae", "storeDataDistrict", "storeDataZip", "storeDataAddress", "storeDataNumber", "storeDataComplement", "storeDataStateRegistration", "storeDataCnpj", "storeDataPhone"].some(key => formData[key]),
        everyStoreData: ["storeDataState","storeDataCity", "storeDataCnae", "storeDataDistrict", "storeDataZip", "storeDataAddress", "storeDataNumber", "storeDataComplement", "storeDataStateRegistration", "storeDataCnpj", "storeDataPhone"].every(key => formData[key]),
        everyDeliveryArea: ["storeDataState","storeDataCity"].every(key => formData[key]),
    }
}