// Send data to register sheet
export async function postToGoogleSheetApi(data) {
    try {

        // Time handlers
        const response = await fetch("https://script.google.com/macros/s/AKfycbyDJrt_-T-AggsUcCx--GBty6Q6r47ttEauWWVZugdtMaWhYzlRksa0nOe_e9wMb7PU1w/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        const results = response.ok

        // Results treatment
        console.log("postToGoogleSheetApi: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("Erro ao salvar log.");
    } catch (error) {
        console.error("Error posting to Google Sheets", error)
        throw error
    }
}