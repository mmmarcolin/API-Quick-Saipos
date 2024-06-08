export const convertBooleanStrings = (obj) => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value === 'true') {
            result[key] = true;
        } else if (value === 'false') {
            result[key] = false;
        } else {
            result[key] = value;
        }
    }
    return result;
};