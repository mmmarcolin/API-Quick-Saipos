export async function getFromZipAPI(cep) {               
    let response, responseData
    try {
        response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.statusText}`)
        }
        responseData = await response.json()

        if (!responseData.street) {
            const message = `CEP únicos: incapaz de cadastrar raios: ${cep}.`
            return { error: true, response: message };
        }

        return null
    } catch (error) {
        return { error: true, response: responseData || response };
    }
}