// Imports
import { $ } from "./../../main.js";

// Function to convert kebab-case to camelCase
function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Function to insert data retrieved from Hubspot
export async function insertHubspotData(hsData) {
    try {
        // Checkboxes
        const checkFieldIds = [
            "payment-types-pix",
            "payment-types-master",
            "payment-types-elo",
            "payment-types-visa",
            "payment-types-amex",
            "payment-types-hiper",
            "payment-types-sodexo",
            "payment-types-alelo",
            "config-col42",
            "config-permissions",
            "config-cancel-pass",
            "config-cancel-reason",
            "config-kds",
            "user-waiter-app",
            "user-cashier",
            "sale-status-left",
            "sale-status-easy-delivery",
            "delivery-area-district",
            "delivery-area-radius",
            "apportionment-proportional",
            "apportionment-bigger",
            "partners-site-delivery",
            "partners-counter-pickup",
            "partners-basic-digital-menu",
            "partners-premium-digital-menu",
            "partners-instruction-counter",
            "partners-instruction-waiter"   
        ];
        
        // Texts
        const valueFieldIds = [
            "partners-start-day",
            "partners-end-day",
            "partners-start-time",
            "partners-end-time",
            "partners-minimum-value",
            "shift-desc",
            "shift-time",
            "shift-service-fee",
            "waiters-quantity",
            "waiters-daily-rate",
            "delivery-men-quantity",
            "delivery-men-daily-rate",
            "partners-ifood-code",
            "partners-ifood-name",
            "table-orders",
            "order-cards",
            "domain",
            "store-id",
            "store-data-state",
            "store-data-city",
            "store-data-district",
            "store-data-address",
            "store-data-number",
            "store-data-zip",
            "store-data-complement",
            "store-data-cnpj",
            "store-data-state-registration",
            "store-data-cnae"
        ]
        
        // Add each response
        checkFieldIds.forEach(field => {
            $(`${field}`).checked = hsData[kebabToCamel(field)]
        });
        valueFieldIds.forEach(field => {
            $(`${field}`).value = hsData[kebabToCamel(field)]
        });
    } catch (error) {
        throw error
    }
}