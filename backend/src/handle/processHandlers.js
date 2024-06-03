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
        menuData: formData.menuCsv ? await handleCSV(formData.menuCsv.path, "card") : "",
        choicesData: formData.choicesCsv ? await handleCSV(formData.choicesCsv.path, "add") : "",
        deliveryAreaData: formData.deliveryAreaCsv ? await handleCSV(formData.deliveryAreaCsv.path, "area") : "",
        deliveryMenData: formData.deliveryMenQuantity ? await handleWorkers(formData.deliveryMenQuantity, formData.deliveryMenDailyRate, "Entregador", formData.saleStatusEasyDelivery) : "",
        usersData: formData.waitersQuantity ? await handleWorkers(formData.waitersQuantity, formData.waitersDailyRate, "Garçom", formData.userCashier) : "",
        ifoodData: formData.partnersIfoodCode ? await handleIfood(formData.partnersIfoodCode, formData.partnersIfoodName) : "",
        shiftData: formData.shiftDesc ? await handleShift(formData.shiftDesc, formData.shiftTime, formData.shiftServiceFee) : "",
        weekDaysData: formData.partnersStartDay ? await handleWeekDays(formData.partnersStartDay, formData.partnersEndDay) : "",
        deliveryOption: formData.deliveryAreaDistrict ? "D" : "A",
        everyStoreData: ["storeDataCnae", "storeDataDistrict", "storeDataZip", "storeDataAddress", "storeDataNumber", "storeDataComplement", "storeDataStateRegistration", "storeDataCnpj"].every(key => formData[key]),
        someStoreData: ["storeDataCnae", "storeDataDistrict", "storeDataZip", "storeDataAddress", "storeDataNumber", "storeDataComplement", "storeDataStateRegistration", "storeDataCnpj", "storeDataState", "storeDataCity"].some(key => formData[key]),
        somePartners: ["partnersSiteDelivery", "partnersBasicDigitalMenu", "partnersPremiumDigitalMenu"].some(key => formData[key]),
        someUser: ["userCashier", "userWaiterApp"].some(key => formData[key]),
        everyDeliveryArea: ["storeDataState","storeDataCity"].every(key => formData[key]),
    }
}