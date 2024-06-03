// Handle shift
export async function handleShift(shiftDescStr, shiftTimeStr, shiftServiceFeeStr) {
    // Split string by commas and remove any surrounding whitespace from each element
    const shiftDesc = shiftDescStr.split(",").map(element => element.trim())
    const shiftTime = shiftTimeStr.split(",").map(element => element.trim())
    const shiftServiceFee = shiftServiceFeeStr.split(",").map(element => element.trim())
    
    // Map over array to create an array of objects
    return shiftDesc.map((desc, index) => ({
        desc: desc,
        time: shiftTime.length === 1 ? shiftTime[0] : (shiftTime[index] || ""),
        serviceFee: shiftServiceFee.length === 1 ? shiftServiceFee[0] : (shiftServiceFee[index] || "0")
    }))
}