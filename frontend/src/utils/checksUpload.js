// Imports
import { $ } from "./../../main.js"

// Function to remove uploads checks
export async function checksUpload() {
    ["menu", "delivery-area", "choices"].forEach(type => {
        // Handle each one
        const label = $(`${type}-label`)
        const removeButton = $(`${type}-remove`)
        
        // Remove when changed
        label.addEventListener("change", event => {
            const fileInput = event.target
            removeButton.style.display = fileInput.files.length > 0 ? "inline" : "none"
        })
        
        // Remove when clicked to cancel selection
        removeButton.addEventListener("click", () => {
            const fileInput = $(`${type}-csv`)
            fileInput.value = "" 
            removeButton.style.display = "none" 
        })
    })
}