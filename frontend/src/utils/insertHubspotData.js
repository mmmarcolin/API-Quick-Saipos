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
            "payment-types-ticket",
            "settings-cancel-password",
            "settings-cancel-reason",
            "settings-kds",
            "waiter-cashier",
            "sale-status-delivery",
            "sale-status-easy-delivery",
            "partners-saipos-bot",
            "ifood-auto-sending"
        ];
        
        // Texts
        const valueFieldIds = [
            "delivery-area-type",
            "apportionment-method",
            "partners",
            "partners-pickup-method",
            "partners-colors",
            "partners-images",
            "ifood-username",
            "ifood-password",
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
            "ifood-code",
            "ifood-name",
            "order-tables",
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
            "store-data-cnae",
            "store-data-phone"
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