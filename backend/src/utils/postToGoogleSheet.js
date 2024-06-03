// Imports
import { formatDate } from "./formatDate.js"

// Send data to register sheet
export async function postToGoogleSheet(data) {
    try {
        // Time handlers
        data.generalData.time.endTime = new Date()
        data.generalData.time.timestamp = parseFloat((data.generalData.time.endTime - data.generalData.time.startTime) / 1000).toFixed(0)
        data.generalData.time.endTime = await formatDate(data.generalData.time.endTime)    
        
        const response = await fetch("https://script.google.com/macros/s/AKfycbw0Bav3zFGj4Cy82MiVVSPWy3I9bjhIAMDPdh9WBbdDQaP_9nREOWbvKGsbM18l7I8r_g/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonData: data
            })
        })
        const results = response.ok

        // Results treatment
        console.log("postToGoogleSheet: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("Error posting to Google Sheets");
    } catch (error) {
        console.error("Error posting to Google Sheets", error)
        throw error
    }
}