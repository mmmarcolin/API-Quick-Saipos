import { $ } from "./../../main.js";

export async function generalVerify() {
    const saiposTokenRegex = /^[a-zA-Z0-9]{64}$/;
    const storeIdRegex = /^\d{5}$/;

    const storeId = $("store-id").value.trim()
    const saiposAuthToken = $("saipos-auth-token").value.trim()
    
    const isStoreIdValid = storeIdRegex.test(storeId);
    const isAuthTokenValid = saiposTokenRegex.test(saiposAuthToken);

    return { isStoreIdValid, isAuthTokenValid };
}