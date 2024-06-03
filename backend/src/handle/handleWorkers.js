// Handle workers
export async function handleWorkers(quantity, dailyRate, worker, extra) {
    let result = []
        
    // Handle quantity input: split string by commas, trim whitespace, or convert to a number
    if (typeof quantity === "string" && quantity.includes(",")) {
        quantity = quantity.split(",").map(element => element.trim())
    } else  {
        let quantityNum = parseInt(quantity)
        quantityNum == NaN ? quantity = [quantity] : quantity = quantityNum
    }
    
    // Handle dailyRate input: split string by commas, trim whitespace, and convert to numbers
    typeof dailyRate === "string" && dailyRate.includes(",") ? dailyRate = dailyRate.split(",").map(item => parseInt(item, 10)) : null
    typeof dailyRate === "string" && !dailyRate.includes(",") ? dailyRate = parseInt(dailyRate, 10) : null
    
    // Determine the number of iterations for the loop
    let iterations = Array.isArray(quantity) ? quantity.length : quantity
    
    // Iterate to create worker descriptions and rates
    for (let i = 0; i < iterations; i++) {
        let desc = Array.isArray(quantity) ? quantity[i] : `${worker} ${i + 1}`;
        let rate = Array.isArray(dailyRate) ? dailyRate[i] : dailyRate;
        
        // Handle cases where the rate might be undefined or invalid
        Array.isArray(dailyRate) && i >= dailyRate.length || isNaN(rate) ? rate = 0 : null;
        result.push({ desc, dailyRate: rate });
    };
    
    // Add extra workers if specified
    worker === "Garçom" && extra ? result.push({ desc: "Caixa", dailyRate: 0 }) : null
    worker === "Entregador" && extra ? result.push({ desc: "Entrega fácil", dailyRate: 0 }) : null
    
    return result // Return
}