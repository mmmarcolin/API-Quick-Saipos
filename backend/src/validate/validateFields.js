// Validates the fields of an object against specified requirements
export function validateFields(data, requiredFields) {
    // Helper function to add formatted error messages to the errors array
    const errors = [];
    const addError = (field, message) => errors.push(`${field}${message}`);

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
                    // Validate date format (YYYY-MM-DDTHH:MM:SS)
                    if (value.length !== 64 || !/^[a-zA-Z0-9]+$/.test(value))
                        addError("", "Token Saipos inválido.");
                    break;

                case "hubspot_id":
                    // Validate email format using a regular expression
                    if (value.length !== 10 || !/^\d+$/.test(value))
                        addError("", "ID Hubspot inválido.");
                    break;
            }
        }
    });

    // Return null if no errors, otherwise return the array of error messages
    return errors.length > 0 ? errors : null;
}

// Validates fields for validating form
export const validateForm = data => validateFields(data, ["saipos_token", "saipos_data"]);

// Validates fields for validating Hubspot integration
export const validateIntegration = data => validateFields(data, ["saipos_token", "hubspot_id"]);