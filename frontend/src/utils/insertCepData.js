// Imports
import { $, display } from "./../../main.js";

// Request to get CEP data
export async function insertCepData() {
    // Verify cep size and chars
    const cep = this.value.trim()
    if (cep.length !== 8) return
    if (!/^\d+$/.test(cep))
        return display.alert("Insira apenas números.")

    try {
        // Show loading animation
        display.loading("Buscando CEP...")

        // Parse response
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        const responseData = await response.json()
        
        // Display result
        if (response.ok) {
            $("store-data-state").value = responseData.state
            $("store-data-city").value = responseData.city
            $("store-data-district").value = responseData.neighborhood
            $("store-data-address").value = responseData.street

            responseData.street === "" 
                ? display.alert("O CEP digitado é único.")
                : display.success("CEP integrado com sucesso.")

        } else {
            display.error("CEP não encontrado.")
        }
    } catch (error) {
        console.error(error)
    }
}