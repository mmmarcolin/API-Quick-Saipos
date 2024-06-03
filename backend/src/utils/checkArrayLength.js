// Function to check array lengths
export function checkArrayLength(quantityStr, rateStr) {
    const quantities = quantityStr.split(",").map(s => s.trim()); // Split and trim the first string
    const rates = rateStr.split(",").map(s => s.trim()); // Split and trim the second string

    // Check if lengths do not match or if certain conditions are met
    return !(quantities.length || 1 || 0 === rates.length) || 
           (quantityStr === "" && rateStr !== "");
}