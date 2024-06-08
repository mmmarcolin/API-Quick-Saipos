// Imports
import { fetchSaipos } from "./../api/saipos/requestsToSaipos.js";
import { checkArrayLength } from "./../utils/checkArrayLength.js";
import { checkShiftLengths } from "./../utils/checkShiftLengths.js";

// Function to validate formatted data
export async function validateData(formData, saiposData, handledData) {
    try {
        // Initialize tests
        let [authTokenTest, storeIdTest, cityTest] = await Promise.all([
            fetchSaipos({
                useSaiposBaseUrl: true,
                byEndpoint: "stores/18",
                method: "GET",
            }),
            fetchSaipos({
                method: "GET"
            }),
            fetchSaipos({
                    method: "GET",
                    useSaiposBaseUrl: true,
                    byEndpoint: `cities?filter=%7B%22where%22:%7B%22id_state%22:${await fetchSaipos({
                        method: "GET",
                        useSaiposBaseUrl: true,
                        byEndpoint: "states",
                        findValue: formData.storeDataState,
                        atKey: "short_desc_state",
                        andReturn: "id_state"
                    })}%7D%7D`,
                    findValue: formData.storeDataCity,
                    atKey: "desc_city",
                    andReturn: "id_city"
            })
        ]);

        // Return invalid token
        if (authTokenTest.error) return ["Token Saipos inválido."]

        // Error checks
        const errorChecks = [
            { test: storeIdTest.error, message: "ID Saipos inválido." },
            { test: cityTest.error, message: "Cidade inválida para este Estado." },
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
        console.log("Error validating data", error)
        throw new Error("Erro ao conectar SaiposAPI.");
    }
}