// Validates the fields of an object against specified requirements
export function validateFields(data, requiredFields) {
    // Helper function to add formatted error messages to the errors array
    const errors = [];
    const addError = (field, message) => errors.push(`${field}${message}`);
    const saiposTokenRegex = /^[a-zA-Z0-9]{64}$/;
    const storeIdRegex = /^\d{5}$/;

    // Iterate over each required field to check for validity
    requiredFields.forEach(field => {
        const value = data[field];
        
        // Check if the field is present in the data
        if (!value) {
            addError(field, " is required");
        } else {
            // Perform specific validations based on the field name
            switch (field) {
                case "saipos_token":
                    if (!saiposTokenRegex.test(value))
                    addError(field, " must be exactly 64 alphanumeric characters");
                    break;
                case "store_id":
                    if (!storeIdRegex.test(value))
                    addError(field, " must consist of exactly 5 digits");
                    break;
                default:
                    break;
            }
        }
    });

    // Return null if no errors, otherwise return the array of error messages
    return errors.length > 0 ? errors : null;
}

// Validates fields for validating form
export const validateForm = data => validateFields(data, []);

// Validates fields for validating Hubspot integration
export const validateIntegration = data => validateFields(data, ["store_id", "saipos_token"]);