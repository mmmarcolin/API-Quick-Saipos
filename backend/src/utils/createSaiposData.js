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
            ticket: formData.paymentTypesTicket,
        },
        settingsChosen: {
            col42: true,
            admPermissions: true,
            kds: formData.settingsKds,
            cancelReason: formData.settingsCancelReason,
            cancelPassword: formData.settingsCancelPassword
        },
        saleStatusChosen: {
            delivery: formData.saleStatusDelivery,
            easyDelivery: formData.saleStatusEasyDelivery
        },
        orderTableChosen: {
            quantity: formData.orderTables
        },
        orderCardChosen: {
            quantity: formData.orderCards
        },
        storeDataChosen: {
            deliveryOption: handledData.someStoreData ? formData.deliveryAreaType?.charAt(0).toUpperCase() : "",
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
            deliverySite: formData.partners.includes("delivery-site"), 
            basicMenu: formData.partners.includes("basic-menu"),
            premiumMenu: formData.partners.includes("premium-menu"),
            saiposBot: formData.partnersSaiposBot,
            images: handledData.somePartners ? formData.partnersImages : "",
            color: handledData.somePartners ? formData.partnersColors : "",
            pickupCounter: handledData.somePartners ? formData.partnersPickupMethod.includes("counter") : "",
            pickupDelivery: handledData.somePartners ? formData.partnersPickupMethod.includes("delivery") : "",
            domain: handledData.somePartners ? formData.domain : "",
            minimumValue: handledData.somePartners ? formData.partnersMinimumValue : "",
            startTime: handledData.somePartners ? formData.partnersStartTime : "",
            endTime: handledData.somePartners ? formData.partnersEndTime : "",
            weekDays: handledData.somePartners ? handledData.weekDaysData : "",
            waiterInstruction: handledData.somePartners ? formData.partnersInstruction == "partnersInstructionWaiter": "",
            counterInstruction: handledData.somePartners ? formData.partnersInstructionCounter == "partnersInstructionCounter" : "",
        },
        usersChosen: {
            users: handledData.someUser ? handledData.usersData : "",
            domain: handledData.someUser ? formData.domain : ""
        },
        ifoodIntegrationChosen: {
            data: handledData.ifoodData,
            username: handledData.someIfoodAutoSending ? formData.ifoodUsername : "",
            password: handledData.someIfoodAutoSending ? formData.ifoodPassword : "",
        },
        shiftsChosen: handledData.shiftData,
        deliveryMenChosen: handledData.deliveryMenData,
        waitersChosen: handledData.usersData,
        deliveryAreasChosen: {
            data: handledData.deliveryAreaData,
            state: handledData.deliveryAreaData ? formData.storeDataState : "",
            city: handledData.deliveryAreaData ? formData.storeDataCity : "",
            deliveryOption: handledData.deliveryAreaData ? formData.deliveryAreaType?.charAt(0).toUpperCase() : "",
        },
        choicesChosen: {
            data: handledData.choicesData,
            apportionmentBigger: handledData.choicesData ? formData.apportionmentMethod === "apportionment-bigger" : "",
            apportionmentProportional: handledData.choicesData ? formData.apportionmentMethod === "apportionment-proportional" : ""
        },
        menuChosen: handledData.menuData,
        generalData: {
            saiposAuthToken: formData.saiposAuthToken,
            storeId: formData.storeId,
            time: {},
        }, 
    }

    // Results handling
    console.log("createSaiposData: " + JSON.stringify(results));
    if (results) return results;
    throw new Error("Error creating insertion object.");
}