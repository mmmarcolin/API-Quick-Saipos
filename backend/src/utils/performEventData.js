import { convertBooleanStrings } from "./convertBooleanStrings.js";
import { parseFormData } from "./parseFormData.js";

export async function performEventData(event) {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    
    if (contentType.includes('multipart/form-data'))
        return convertBooleanStrings(await parseFormData(event))

    if (contentType.includes('application/json'))
        return JSON.parse(event.body);
}