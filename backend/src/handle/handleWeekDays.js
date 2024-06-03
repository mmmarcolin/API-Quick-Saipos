// Handle weekdays
export async function handleWeekDays(startDay, endDay) {
    // Initiate days
    const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const startIndex = weekDays.indexOf(startDay.toLowerCase())
    const endIndex = weekDays.indexOf(endDay.toLowerCase())
    
    // Add days boolean to array
    let result = {}
    weekDays.forEach((day, index) => {
        if (startIndex <= endIndex)
            result[day] = index >= startIndex && index <= endIndex
        else
            result[day] = index >= startIndex || index <= endIndex
    })
    
    return result // Return
}