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
            body: insertData ? options.body = JSON.stringify(insertData) : null
        }

        const baseUrl = "https://api.saipos.com/v1"
        const url = useSaiposBaseUrl 
            ? `${baseUrl}/${byEndpoint}`
            : `${baseUrl}/stores/${storeId}/${byEndpoint}`

        // console.log("FETCH", {   
        //     method, 
        //     byEndpoint, 
        //     findValue,
        //     atKey,
        //     andReturn,
        //     useSaiposBaseUrl,
        //     insertData,
        // },{
        //     url: url,
        //     options: options
        // })

        response = await fetch(url, options)
        // console.log("RESPONSE", response)
        if (!response.ok) {
            throw new Error(`HTTP: ${response.status}`);  
        }
        
        responseData = await response.json()
        // console.log("RESPONSEDATA", responseData)
        
        if (method === "GET") {
            handledData = await handleResponseData(responseData, findValue, atKey, andReturn)
        }

        return handledData || true
    } catch (error) {
        return { error: true, response: handledData || responseData || response }
    }
}

export async function handleResponseData(responseData, findValue, atKey, andReturn) {
    function getValueByPath(obj, path) {
        if (path === "") {
            return obj;
        }

        return path.split(/[\.\[\]\'\"]/).filter(p => p).reduce((acc, key) => {
            return acc[key];
        }, obj);
    }

    try {
        let result = responseData
        if (Array.isArray(responseData)) {
            result = responseData.find(res => normalizeText(getValueByPath(res, atKey)) || "" == normalizeText(findValue)) 
            if (!result) {return `Valor ${findValue} não encontrado na chave ${atKey}.`}
        }        

        result = getValueByPath(result, andReturn)
        if (!result) return `Chave ${andReturn} não encontrada no objeto resposta.`

        return result
    } catch (error) {
        console.log(error)
        return responseData;  
    }
}