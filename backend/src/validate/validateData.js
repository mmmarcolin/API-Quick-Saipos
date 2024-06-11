// Imports
import { storeId } from "../config/variables.js";
import { fetchSaipos } from "./../api/saipos/requestsToSaipos.js";
import { checkArrayLength } from "./../utils/checkArrayLength.js";
import { checkShiftLengths } from "./../utils/checkShiftLengths.js";

// Function to validate formatted data
export async function validateData(formData, saiposData, handledData) {
    try {
        // Validation regex 
        const timeRegex = /^(?:[01]\d|2[0-3])[0-5]\d$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation functions
        const validateEmail = (elementId) => formData[elementId] && !emailRegex.test(formData[elementId]);
        const getOnlyNumbers = (elementId) => (formData[elementId].match(/\d+/g) || []).join('').length;
        const normalizeTimeFormat = (value) => { return (value.match(/\d+/g) || []).join("") };

        const validateSplittedValues = (elementId, config = {}) => {
            const values = formData[elementId].split(',');

            const errors = values.map(val => {
                let cleanedValue = val.trim();
                if (config.onlyNumbers) cleanedValue = (val.match(/\d+/g) || []).join('');
                if (config.removeSpaces) cleanedValue = val.replace(/\s+/g, "");
                if (config.hoursFormat) {
                    cleanedValue = normalizeTimeFormat(cleanedValue);
                    return cleanedValue.length > 0
                        ? !(cleanedValue.length === 4 && timeRegex.test(cleanedValue))
                        : false;
                }
                
                if (typeof config.invalidLengths === "number")
                    return cleanedValue.length >= config.invalidLengths;
                
                if (Array.isArray(config.invalidLengths))
                    return !config.invalidLengths.includes(cleanedValue.length);
                
                return false;
            }).filter(error => error === true);
            
            return errors.length > 0;
        };
        
        // Initialize tests
        let [authTokenTest, storeIdTest, cityTest] = await Promise.all([
            fetchSaipos({
                useSaiposBaseUrl: true,
                byEndpoint: "stores/18",
                method: "GET",
            }),
            fetchSaipos({
                useSaiposBaseUrl: true,
                byEndpoint: `stores/${storeId}`,
                method: "GET",
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
        const errorChecks = [{ 
                test: storeIdTest.error || !storeId, 
                message: "ID Saipos inválido." 
            },{ 
                test: cityTest.error, 
                message: "Cidade inválida para este Estado." 
            },{ 
                test: (handledData.someUser || handledData.somePartners) && !formData.domain, 
                message: "Insira o domínio." 
            },{ 
                test: handledData.someStoreData && !handledData.everyStoreData, 
                message: "Insira os dados da Loja." 
            },{ 
                test: handledData.someAutoSending && !handledData.everyAutoSending, 
                message: "Insira as informações para disparo automático." 
            },{ 
                test: saiposData.deliveryAreasChosen.data && !handledData.everyDeliveryArea, 
                message: "Insira a localização da loja." 
            },{ 
                test: checkArrayLength(formData.deliveryMenQuantity, formData.deliveryMenDailyRate), 
                message: "Insira os entregadores proporcionalmente." 
            },{ 
                test: checkArrayLength(formData.waitersQuantity, formData.waitersDailyRate), 
                message: "Insira os garçons proporcionalmente." 
            },{ 
                test: checkShiftLengths(formData.shiftDesc, formData.shiftTime), 
                message: "Insira os turnos proporcionalmente." 
            },{ 
                test: validateSplittedValues("storeDataCnpj", { invalidLengths: [11, 14, 0], onlyNumbers: true }), 
                message: `Formato de CNPJ/CPF inválido (${getOnlyNumbers("storeDataCnpj")} caracteres).` 
            },{ 
                test: validateSplittedValues("storeDataCnae", { invalidLengths: [7, 0], onlyNumbers: true }), 
                message: `Formato de CNAE inválido (${getOnlyNumbers("storeDataCnae")} caracteres).` 
            },{ 
                test: validateSplittedValues("storeDataZip", { invalidLengths: [8, 0], onlyNumbers: true }), 
                message: `Formato de CEP inválido (${getOnlyNumbers("storeDataZip")} caracteres).` 
            },{ 
                test: validateSplittedValues("shiftServiceFee", { invalidLengths: 3, onlyNumbers: true }), 
                message: `Valor de taxa de serviço inválido (${formData["shiftServiceFee"]}).` 
            },{ 
                test: validateSplittedValues("ifoodCode", { invalidLengths: [36, 0] }), 
                message: `Formato de código Ifood inválido (${formData["ifoodCode"]}).` 
            },{ 
                test: validateEmail("ifoodUsername"), 
                message: "Formato de Email Ifood inválido." 
            },{ 
                test: validateSplittedValues("shiftTime", { hoursFormat: true }), 
                message: `Formato de horário dos turnos inválido (${formData["shiftTime"]}).` 
            },{ 
                test: validateSplittedValues("partnersStartTime", { hoursFormat: true }) || validateSplittedValues("partnersEndTime", { hoursFormat: true }), 
                message: `Formato de horário dos Canais de Venda inválido (${formData["partnersStartTime"]}, ${formData["partnersEndTime"]}).` 
            }
        ];
        
        // Collect error messages
        const results = errorChecks.reduce((errors, check) => {
            if (check.test) errors.push(`• ${check.message}`);
            return errors;
        }, ["REVISE OS ERROS DE FORMATAÇÃO:", ""]);

        // Results handling
        console.log("validateData: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("Error validating data");
    } catch (error) {
        console.log("Error validating data", error)
        throw new Error("Erro ao conectar SaiposAPI.");
    }
}