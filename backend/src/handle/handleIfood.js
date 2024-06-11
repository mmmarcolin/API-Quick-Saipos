// Handle Ifood
export async function handleIfood(ifoodCodeStr, ifoodNameStr) {
    // Split string by commas and remove any surrounding whitespace from each element
    const ifoodCode = ifoodCodeStr.split(",").map(element => element.trim())
    const ifoodName = ifoodNameStr.split(",").map(element => element.trim())
    
    // Map over array to create an array of objects
    return ifoodCode.map((code, index) => ({
        code: code,
        name: ifoodName.length === 1 ? ifoodName[0] : ifoodName[index]
    }))
}