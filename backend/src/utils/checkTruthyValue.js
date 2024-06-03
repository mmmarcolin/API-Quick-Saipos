// Function to check if property is valid
export async function checkTruthyValue(value) {
    // Checks for string and boolean
    if ((typeof value === "string" && value.length > 0 && !(value.length == 1 && value[0] == " ")) || (typeof value === "boolean" && value))
        return true

    // Checks for array
    else if (Array.isArray(value)) {
        for (const element of value) {
            if (await checkTruthyValue(element))
                return true
        }
        
    // Checks for object
    } else if (typeof value === "object" && value !== null) {
        for (const key in value) {
            if (await checkTruthyValue(value[key]))
                return true
        }
    }

    // Returns false if none
    return false
}