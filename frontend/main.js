// Style imports
import "./public/styles/actions.css";
import "./public/styles/container.css";
import "./public/styles/content.css";
import "./public/styles/general.css";
import "./public/styles/responsivity.css";
import "./public/styles/animations.css";

// Function imports
import { Display } from "./src/Classes/Display.js";
import { logicHubspotData } from "./src/logic/logicHubspotData.js";
import { logicSaiposData } from "./src/logic/logicSaiposData.js";
import { insertCepData } from "./src/utils/insertCepData.js";
import { cleanForms } from "./src/utils/cleanForms.js";
import { checksUpload } from "./src/utils/checksUpload.js";
import { checkboxesRelation } from "./src/utils/checkboxesRelation.js";

// Exports
export const display = new Display
export var $ = function(id) { return document.getElementById(id); };

// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function() {
    // Getting cached token
    $("saipos-auth-token").value = localStorage.getItem("saiposToken") || "";

    // Click listener to integrate Hubspot
    $("hubspot-button").addEventListener("click", logicHubspotData);
    
    // Click listener to execute configuration
    $("execute-button").addEventListener("click", logicSaiposData);
    
    // Click listener to clean forms
    $("clean-button").addEventListener("click", cleanForms);
    
    // Input listener to retrieve CEP data
    $("store-data-zip").addEventListener("input", insertCepData)

    // AlwaysWatching Listeners for checkboxes and upload checks
    checksUpload()
    checkboxesRelation()
});