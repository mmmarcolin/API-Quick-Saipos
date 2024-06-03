// Date formatting
export async function formatDate(end) {
    const day = end.getDate().toString().padStart(2, "0")
    const month = (end.getMonth() + 1).toString().padStart(2, "0")
    const year = end.getFullYear()
    const hours = end.getHours().toString().padStart(2, "0")
    const minutes = end.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
}