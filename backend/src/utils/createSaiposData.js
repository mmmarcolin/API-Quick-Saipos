import { normalizeText } from "./../config/variables.js";

// Function to create data to execute configure
export async function createSaiposData(formData, handledData) {
    // create object
    const results = { 
        paymentTypesChosen: {
            pix: formData.paymentTypesPix,
            elo: formData.paymentTypesElo,
            master: formData.paymentTypesMaster,
            visa: formData.paymentTypesVisa,
            amex: formData.paymentTypesAmex,
            hiper: formData.paymentTypesHiper,
            sodexo: formData.paymentTypesSodexo,
            alelo: formData.paymentTypesAlelo,
        },
        settingsChosen: {
            col42: formData.configCol42,
            kds: formData.configKds,
            cancelReason: formData.configCancelReason,
            cancelPassword: formData.configCancelPass,
            admPermissions: formData.configPermissions
        },
        saleStatusChosen: {
            delivery: formData.saleStatusLeft,
            easyDelivery: formData.saleStatusEasyDelivery
        },
        tableOrderChosen: {
            quantity: formData.tableOrders
        },
        orderCardChosen: {
            quantity: formData.orderCards
        },
        storeDataChosen: {
            deliveryOption: handledData.someStoreData ? formData.deliveryAreaRadius ? "A" : "D" : "", 
            state: handledData.someStoreData ? formData.storeDataState : "",
            city: handledData.someStoreData ? formData.storeDataCity : "",
            cnae: handledData.someStoreData ? formData.storeDataCnae.replace(/\D+/g, "") : "",
            district: handledData.someStoreData ? formData.storeDataDistrict : "",
            zipCode: handledData.someStoreData ? normalizeText(formData.storeDataZip).slice(0, 5) + "-" + normalizeText(formData.storeDataZip.slice(5)) : "",
            address: handledData.someStoreData ? formData.storeDataAddress : "",
            addressNumber: handledData.someStoreData ? formData.storeDataNumber : "",
            addressComplement: handledData.someStoreData ? formData.storeDataComplement : "",
            stateReg: handledData.someStoreData ? normalizeText(formData.storeDataStateRegistration) : "",
            cnpj: handledData.someStoreData ? normalizeText(formData.storeDataCnpj) : "",
            phone: handledData.someStoreData ? normalizeText(formData.storeDataCnpj).slice(-11) : "",
        },
        partnersChosen: {
            deliverySite: formData.partnersSiteDelivery, 
            basicMenu: formData.partnersBasicDigitalMenu,
            premiumMenu: formData.partnersPremiumDigitalMenu,
            pickupCounter: handledData.somePartners ? formData.partnersCounterPickup : "",
            domain: handledData.somePartners ? formData.domain : "",
            minimumValue: handledData.somePartners ? formData.partnersMinimumValue : "",
            startTime: handledData.somePartners ? formData.partnersStartTime : "",
            endTime: handledData.somePartners ? formData.partnersEndTime : "",
            weekDays: handledData.somePartners ? handledData.weekDaysData : "",
            waiterInstruction: handledData.somePartners ? formData.partnersInstructionWaiter : "",
            counterInstruction: handledData.somePartners ? formData.partnersInstructionCounter : "",
        },
        usersChosen: {
            users: handledData.someUser ? handledData.usersData : "",
            domain: handledData.someUser ? formData.domain : ""
        },
        ifoodIntegrationChosen: {
            data: handledData.ifoodData,
            username: handledData.ifoodData && formData.configAccAval ? formData.partnersIfoodUsername : "",
            password: handledData.ifoodData && formData.configAccAval ? formData.partnersIfoodPassword : "",
        },
        shiftsChosen: handledData.shiftData,
        deliveryMenChosen: handledData.deliveryMenData,
        waitersChosen: handledData.usersData,
        deliveryAreasChosen: {
            data: handledData.deliveryAreaData,
            state: handledData.deliveryAreaData ? formData.storeDataState : "",
            city: handledData.deliveryAreaData ? formData.storeDataCity : "",
            deliveryOption: handledData.deliveryAreaData ? formData.deliveryAreaRadius ? "A" : "D" : "",
        },
        choicesChosen: {
            data: handledData.choicesData,
            apportionmentBigger: handledData.choicesData ? formData.apportionmentBigger : "",
            apportionmentProportional: handledData.choicesData ? formData.apportionmentProportional : ""
        },
        menuChosen: handledData.menuData,
        generalData: {
            storeId: formData.storeId,
            time: {},
        }, 
    }

    // Results handling
    console.log("createSaiposData: " + JSON.stringify(results));
    if (results) return results;
    throw new Error("Error creating insertion object.");
}