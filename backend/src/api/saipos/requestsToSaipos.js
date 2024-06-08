// Imports
import { normalizeText, saiposToken, storeId } from "./../../config/variables.js"

export async function fetchSaipos({
    method, 
    byEndpoint = "", 
    findValue = "",
    atKey = "",
    andReturn = "",
    useSaiposBaseUrl = false,
    insertData = null, 
}) {
    let response, responseData, handledData
    try {
        const options = {
            method: method,
            headers: {
                "Authorization": saiposToken,
                "Content-Type": "application/json"
            },
            body: insertData ? JSON.stringify(insertData) : null
        }

        const baseUrl = "https://api.saipos.com/v1"
        const url = useSaiposBaseUrl 
            ? `${baseUrl}/${byEndpoint}`
            : `${baseUrl}/stores/${storeId}/${byEndpoint}`

        response = await fetch(url, options)
        if (!response.ok) throw new Error(`HTTP: ${response.status}`);  
        responseData = await response.json()

        if (method === "GET") {
            handledData = await handleResponseData(responseData, findValue, atKey, andReturn)

            if (handledData.err) {
                handledData = handledData.msg
                throw new Error();
            } 
        }

        return handledData || responseData[andReturn]
    } catch (error) {
        return { error: true, response: handledData || responseData || response }
    }
}

export async function handleResponseData(responseData, findValue, atKey, andReturn) {
    function getValueByPath(obj, path) {
        if (path === "") return obj;

        return path.split(/[\.\[\]\'\"]/).filter(p => p).reduce((acc, key) => {
            return acc[key];
        }, obj);
    }

    try {
        let result = responseData;
        if (Array.isArray(responseData)) {
            if (Array.isArray(findValue)) {
                const results = findValue.map(value => responseData.find(res => normalizeText(getValueByPath(res, atKey)) === normalizeText(value)));
                const returnValueArray = results.map(result => result && result[andReturn]);
                if (returnValueArray.includes(undefined)) return {err, msg: `Pelo menos um valor de ${findValue} não foi encontrado na chave ${atKey}.`};
                result = returnValueArray;
            } else {
                if (findValue === "every") {
                    result = result
                } else if (responseData.length === 1 || findValue === "") {
                    result = responseData[0];
                } else {
                    result = responseData.find(res => normalizeText(getValueByPath(res, atKey)) === normalizeText(findValue));
                    if (!result) return {err: true, msg: `Valor ${findValue} não encontrado na chave ${atKey}.`};
                }
                result = getValueByPath(result, andReturn)
            }
        } else {
            result = getValueByPath(result, andReturn);
            if (!result) return {err, msg: `Chave ${andReturn} não encontrada no objeto resposta.`};
        }
        
        return result;
    } catch (error) {
        console.log(error)
        return responseData;  
    }
}