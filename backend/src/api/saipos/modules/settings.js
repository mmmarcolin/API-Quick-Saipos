import { Settings } from "./../Classes/Settings.js"
import { AdmPermissions } from "./../Classes/AdmPermissions.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function settings(quickData) {
    const operations = []
    const everyResults = []
    
    async function getSettingId(id) {
        return await fetchSaipos({
            method: "GET",
            byEndpoint: "setting_values",
            findValue: id,
            atKey: "id_setting",
            andReturn: "id_store_setting_value"
        })
    }
    async function putSettingValue(settingId, newValue) {
        return await fetchSaipos({
            method: "PUT",
            byEndpoint: `setting_values/${settingId}`, 
            insertData: newValue
        })
    }

    try {
        let userData = await fetchSaipos({
            method: "GET",
            byEndpoint: "find-all-users",
            findValue: 1,
            atKey: "user.user_type",
            andReturn: "user"
        })
        everyResults.push(userData)

        if (quickData.cancelPassword) {
            userData.cancellation_password = "123"
            operations.push(putSettingValue(await getSettingId("62"), new Settings("1")))
            operations.push(fetchSaipos({
                method: "POST",
                byEndpoint: "update-user", 
                insertData: userData 
            }))
        }

        if (quickData.admPermissions) {
            operations.push(fetchSaipos({ 
                method: "POST",
                byEndpoint: "update-permission", 
                insertData: new AdmPermissions(userData.permissions).permissions 
            }))
        }

        if (quickData.col42) {
            operations.push(putSettingValue(await getSettingId("2"), new Settings("42")))
        }

        if (quickData.kds) {
            operations.push(putSettingValue(await getSettingId("57"), new Settings("1")))
        }

        if (quickData.cancelReason) {
            operations.push(putSettingValue(await getSettingId("61"), new Settings("1")))
        }

        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering settings.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}