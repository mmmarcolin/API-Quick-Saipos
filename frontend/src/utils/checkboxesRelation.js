// Imports
import { $ } from "./../../main.js";

// Sync and run checkboxes functions
export async function checkboxesRelation() {
    // Synchronize dependent checkboxes
    function syncCheckboxes(control, target, isGroup = false) {
        if (isGroup) {
            // Listener for the control checkbox to update all group checkboxes
            control.addEventListener("change", () => {
                document.querySelectorAll(target).forEach(checkbox => {
                    checkbox.checked = control.checked;
                });
            });

            // Listener for each checkbox in the group to update the control checkbox
            document.querySelectorAll(target).forEach(checkbox => {
                checkbox.addEventListener("change", () => {
                    control.checked = 
                        document.querySelectorAll(target).length ===
                        document.querySelectorAll(`${target}:checked`).length;
                });
            });
        } else {
            // Listener for the control checkbox to update a single target checkbox
            control.addEventListener("change", () => {
                let targetCheckbox = $(target);
                if (control.type === "checkbox") {
                    targetCheckbox.checked = control.checked;
                } 
            });

            // New listeners for text input and file input
            if (control.type === "text" || control.type === "file") {
                control.addEventListener("input", () => {
                    let targetCheckbox = $(target);
                    targetCheckbox.checked = control.value.length > 0;
                });
            }
        }
    }
    
    // Run exclusive checkboxes
    function toggleExclusiveCheckboxes(checkbox1, checkbox2) {
        // Watch when one change, evaluate the other
        function toggleCheckbox(source, target) {
            source.addEventListener("change", () => {
                if (source.checked && target.checked) {
                    target.checked = false;
                }
            });
        }
        
        // Apply to both directions
        toggleCheckbox(checkbox1, checkbox2);
        toggleCheckbox(checkbox2, checkbox1);
    }

    // Sync group checkboxes
    syncCheckboxes($("payment-types-all"), ".select-all-pay input[type=checkbox]:not(#payment-types-all)", true);
    syncCheckboxes($("config-all"), ".select-all-conf input[type=checkbox]:not(#config-all)", true);

    // Sync individual and new text input and file input checkboxes
    syncCheckboxes($("partners-site-delivery"), "partners-counter-pickup");
    syncCheckboxes($("partners-premium-digital-menu"), "partners-instruction-counter");
    syncCheckboxes($("partners-ifood-code"), "config-acc-aval");
    syncCheckboxes($("choices-csv"), "apportionment-proportional");
    syncCheckboxes($("menu-csv"), "checkbox-for-file");
    syncCheckboxes($("delivery-area-csv"), "delivery-area-radius");

    // Exclusive checkboxes
    toggleExclusiveCheckboxes($("sale-status-left"), $("sale-status-easy-delivery"));
    toggleExclusiveCheckboxes($("delivery-area-district"), $("delivery-area-radius"));
    toggleExclusiveCheckboxes($("apportionment-proportional"), $("apportionment-bigger"));
    toggleExclusiveCheckboxes($("partners-basic-digital-menu"), $("partners-premium-digital-menu"));
    toggleExclusiveCheckboxes($("partners-instruction-counter"), $("partners-instruction-waiter"));
}