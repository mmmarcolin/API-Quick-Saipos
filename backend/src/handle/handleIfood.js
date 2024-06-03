// Handle Ifood
export async function handleIfood(partnersIfoodCodeStr, partnersIfoodNameStr) {
    // Split string by commas and remove any surrounding whitespace from each element
    const partnersIfoodCode = partnersIfoodCodeStr.split(",").map(element => element.trim())
    const partnersIfoodName = partnersIfoodNameStr.split(",").map(element => element.trim())
    
    // Map over array to create an array of objects
    return partnersIfoodCode.map((code, index) => ({
        code: code,
        name: partnersIfoodName.length === 1 ? partnersIfoodName[0] : partnersIfoodName[index]
    }))
}