// Imports
import { checkArrayLength } from "./../utils/checkArrayLength.js";
import { checkShiftLengths } from "./../utils/checkShiftLengths.js";
import { validateSaiposAuth } from "./validateSaiposAuth.js";

// Function to validate formatted data
export async function validateData(formData, saiposData, handledData) {
    try {
        // Initialize tests
        let [authTokenTest, storeIdTest] = await Promise.all([
            validateSaiposAuth(18),
            validateSaiposAuth(formData.storeId)
        ]);

        // Return invalid token
        if (authTokenTest)
            return ["Token Saipos inválido."]

        // Error checks
        const errorChecks = [
            { test: storeIdTest, message: "ID Saipos inválido." },
            { test: (handledData.someUser || handledData.somePartners) && !formData.domain, message: "Insira o domínio." },
            { test: handledData.someStoreData && !handledData.everyStoreData, message: "Insira os dados da Loja." },
            { test: saiposData.deliveryAreasChosen.data && !handledData.everyDeliveryArea, message: "Insira a localização da loja." },
            { test: checkArrayLength(formData.deliveryMenQuantity, formData.deliveryMenDailyRate), message: "Insira os entregadores proporcionalmente." },
            { test: checkArrayLength(formData.waitersQuantity, formData.waitersDailyRate), message: "Insira os garçons proporcionalmente." },
            { test: checkShiftLengths(formData.shiftDesc, formData.shiftTime), message: "Insira os turnos proporcionalmente." }
        ];
        
        // Collect error messages
        const results = errorChecks.reduce((errors, check) => {
            if (check.test) errors.push(check.message);
            return errors;
        }, []);

        // Results handling
        console.log("validateData: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("Error validating data");
    } catch (error) {
        return "Erro ao estabelecer conexão."
    }
}
