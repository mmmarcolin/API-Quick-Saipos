import { display } from "./../../main.js";

export async function validatedFormData(dataToEval) {
    try {
        // Transform formData
        const data = ((formData) => {
            const obj = {};
            formData.forEach((value, key) => { obj[key] = value });
            return obj;
        })(dataToEval);

        // Validation regex 
        const timeRegex = /^(?:[01]\d|2[0-3])[0-5]\d$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation functions
        const validateEmail = (elementId) => data[elementId] && !emailRegex.test(data[elementId]);
        const getInt = (elementId) => parseInt((data[elementId].match(/\d+/g) || []).join(''));
        const getOnlyNumbers = (elementId) => (data[elementId].match(/\d+/g) || []).join('').length;
        const getWithoutSpacesLength = (elementId) => data[elementId].replace(/\s+/g, "").length;
        const normalizeTimeFormat = (value) => { return (value.match(/\d+/g) || []).join("") };

        const validateSplittedValues = (elementId, config = {}) => {
            const values = data[elementId].split(',');

            const errors = values.map(val => {
                let cleanedValue = val;
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

        // Define tests to info and invalid
        const limitToInfo = [
            { 
                test: getInt("orderCards") >= 500, 
                message: `Quantidade de comandas muito grande (${getInt("orderCards")}).` 
            },{ 
                test: getInt("tableOrders") >= 200, 
                message: `Quantidade de mesas muito grande (${getInt("tableOrders")}).` 
            },{ 
                test: getInt("partnersMinimumValue") >= 100, 
                message: `Valor de pedido mínimo muito alto (${getInt("partnersMinimumValue")}).` 
            },{ 
                test: getWithoutSpacesLength("domain") >= 26 , 
                message: `Domínio muito grande (${getWithoutSpacesLength("domain")} caracteres).` 
            },{ 
                test: getWithoutSpacesLength("storeDataAddress") >= 50, 
                message: `Endereço muito grande (${getWithoutSpacesLength("storeDataAddress")} caracteres).` 
            },{ 
                test: getWithoutSpacesLength("storeDataNumber") >= 5, 
                message: `Endereço (número) muito grande (${getWithoutSpacesLength("storeDataNumber")} caracteres).` 
            },{ 
                test: getWithoutSpacesLength("storeDataComplement") >= 50, 
                message: `Complemento muito grande (${getWithoutSpacesLength("storeDataComplement")} caracteres).` 
            },{ 
                test: validateSplittedValues("waitersDailyRate", { invalidLengths: 4, onlyNumbers: true }),
                message: `Valor de diária de garçons muito alto (${data["waitersDailyRate"]}).` 
            },{ 
                test: validateSplittedValues("deliveryMenDailyRate", { invalidLengths: 4, onlyNumbers: true }),
                message: `Quantidade de garçons muito alta (${data["deliveryMenDailyRate"]}).` 
            },{ 
                test: validateSplittedValues("waitersQuantity", { invalidLengths: 2, onlyNumbers: true }),
                message: `Valor de diária de entregadores muito alto (${data["waitersQuantity"]}).` 
            },{ 
                test: validateSplittedValues("deliveryMenQuantity", { invalidLengths: 2, onlyNumbers: true }),
                message: `Quantidade de entregadores muito alta (${data["deliveryMenQuantity"]}).` 
            },{ 
                test: validateSplittedValues("shiftDesc", { invalidLengths: 15 }), 
                message: `Descrição de turno muito grande (${data["shiftDesc"]}).` 
            }
        ];
        const invalidInput = [
            { 
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
                message: `Valor de taxa de serviço inválido (${data["shiftServiceFee"]}).` 
            },{ 
                test: validateSplittedValues("partnersIfoodCode", { invalidLengths: [36, 0] }), 
                message: `Formato de código Ifood inválido (${data["partnersIfoodCode"]}).` 
            },{ 
                test: validateEmail("partnersIfoodUsername"), 
                message: "Formato de Email Ifood inválido." 
            },{ 
                test: validateSplittedValues("shiftTime", { hoursFormat: true }), 
                message: `Formato de horário dos turnos inválido (${data["shiftTime"]}).` 
            },{ 
                test: validateSplittedValues("partnersStartTime", { hoursFormat: true }) || validateSplittedValues("partnersEndTime", { hoursFormat: true }), 
                message: `Formato de horário dos Canais de Venda inválido (${data["partnersStartTime"]}, ${data["partnersEndTime"]}).` 
            }
        ];

        // Collect error messages for each group
        const resultsLimitToInfo = limitToInfo.reduce((errors, check) => {
            if (check.test) errors.push(check.message);
            return errors;
        }, ["DESEJA CONTINUAR?", ""]);
        const resultsInvalidInput = invalidInput.reduce((errors, check) => {
            if (check.test) errors.push(check.message);
            return errors;
        }, ["REVISE OS ERROS DE FORMATAÇÃO:", ""]);

        // Return messages for each group
        if (resultsLimitToInfo.length > 2) return { status: "info", data: resultsLimitToInfo };
        if (resultsInvalidInput.length > 2) return { status: "alert", data: resultsInvalidInput };
        return null;
    } catch (error) {
        return display.error(["Erro ao validar dados."]);
    }
}