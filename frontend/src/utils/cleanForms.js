// Imports
import { $ } from "./../../main.js";

// Function to clean selection of form
export async function cleanForms() {
    // Handle and remove each one of check upload
    document.querySelectorAll('.upload-label').forEach(label => {
        label.style.backgroundColor = '#f8f8f8';
        label.style.color = '#5E190B'; 
    })

    // Handle and clean each input/select
    document.querySelectorAll("input").forEach(element => {
        if (element === $("saipos-auth-token") || element.type === "button") 
            return
        if (element.type === "checkbox")
            element.checked = false
        else
            element.value = ""
    })

    // Rollback to default values
    $("apportionment-method").value = "apportionment-proportional"
    $("delivery-area-type").value = "districts"
}