// Function to check shift lengths
export function checkShiftLengths(descStr, timeStr) {
    const descs = descStr.split(",").map(s => s.trim()); // Split and trim the first string
    const times = timeStr.split(",").map(s => s.trim()); // Split and trim the second string

    // Check if lengths do not match or if certain conditions are met
    return !(descs.length === times.length) || 
           (descStr === "" && timeStr !== "") || 
           (descStr !== "" && timeStr === "");
}