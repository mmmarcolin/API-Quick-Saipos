import { Settings } from "./../Classes/Settings.js"
import { AdmPermissions } from "./../Classes/AdmPermissions.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function settings(quickData) {
    const operations = []
    const everyResults = []
    
    async function putSettingValue(settingId, newValue) {
        return await fetchSaipos({
            method: "PUT",
            byEndpoint: `setting_values/${settingId}`, 
            insertData: newValue
        })
    }

    try {
        const allUsers = await fetchSaipos({
            method: "GET",
            byEndpoint: "find-all-users",
            findValue: true,
            andReturn: "",
        })
        everyResults.push(allUsers)
        let userData = allUsers.reduce((oldest, item) => {
            return (new Date(oldest.created_at) < new Date(item.created_at)) ? oldest : item;
        });

        const settingIds = await fetchSaipos({
            method: "GET",
            byEndpoint: "setting_values",
            findValue: [62, 2, 57, 61],
            atKey: "id_setting",
            andReturn: "id_store_setting_value"
        })
        everyResults.push(settingIds)

        if (quickData.cancelPassword) {
            userData.cancellation_password = "123"
            operations.push(putSettingValue(settingIds[0], new Settings("1")))
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
            operations.push(putSettingValue(settingIds[1], new Settings("42")))
        }

        if (quickData.kds) {
            operations.push(putSettingValue(settingIds[2], new Settings("1")))
        }

        if (quickData.cancelReason) {
            operations.push(putSettingValue(settingIds[3], new Settings("1")))
        }

        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering settings.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}