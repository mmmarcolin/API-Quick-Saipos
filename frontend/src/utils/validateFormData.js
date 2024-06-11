import { display } from "./../../main.js";

export async function validatedFormData(dataToEval) {
    try {
        // Transform formData
        const data = ((formData) => {
            const obj = {};
            formData.forEach((value, key) => { obj[key] = value });
            return obj;
        })(dataToEval);

        // Validation functions
        const getInt = (elementId) => parseInt((data[elementId].match(/\d+/g) || []).join(''));
        const getWithoutSpacesLength = (elementId) => data[elementId].replace(/\s+/g, "").length;

        const validateSplittedValues = (elementId, config = {}) => {
            const values = data[elementId].split(',');

            const errors = values.map(val => {
                let cleanedValue = val.trim();
                if (config.onlyNumbers) cleanedValue = (val.match(/\d+/g) || []).join('');
                
                if (typeof config.invalidLengths === "number")
                    return cleanedValue.length >= config.invalidLengths;

                return false;
            }).filter(error => error === true);
            
            return errors.length > 0;
        };

        // Define tests to info and invalid
        const limitToInfo = [
            { 
                test: getInt("orderCards") >= 300, 
                message: `Quantidade de comandas muito grande (${getInt("orderCards")}).` 
            },{ 
                test: getInt("orderTables") >= 100, 
                message: `Quantidade de mesas muito grande (${getInt("orderTables")}).` 
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

        // Collect error messages
        const resultsLimitToInfo = limitToInfo.reduce((errors, check) => {
            if (check.test) errors.push(`• ${check.message}`);
            return errors;
        }, ["DESEJA CONTINUAR?", ""]);

        // Return messages
        if (resultsLimitToInfo.length > 2) return { status: "question", data: resultsLimitToInfo };
        return null;
    } catch (error) {
        return display.error(["Erro ao validar dados."]);
    }
}