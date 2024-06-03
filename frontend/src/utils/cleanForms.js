// Imports
import { $ } from "./../../main.js";

// Function to clean selection of form
export async function cleanForms() {
    // Handle and remove each one of check upload
    ["menu-remove", "delivery-area-remove", "choices-remove"].forEach(id => {
        $(id).style.display = "none"
    })
    
    // Handle and clean each input/select
    document.querySelectorAll("input, select").forEach(element => {
        if (element != $("saipos-auth-token")) {
            if (element.type === "checkbox")
                element.checked = false
            if (element.type !== "button")
                element.value = ""
        }
    })
}