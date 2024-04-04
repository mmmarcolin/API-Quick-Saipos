const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Settings {
  constructor() {
    this.setting_value = 1 
  }
}

class CancPass {
  constructor(data) {
    this.id_user = data.id_user
    this.cancellation_password = "123" 
  }
}

class AdmPerm {
  constructor(data) {
    this.permissions = data.map(permission => ({
      ...permission,
      allowed: permission.allowed === "N" ? "S" : permission.allowed
    }))
  }
}

async function settings(chosenData) {
  try {
    const userData = await getFromSaipos("user.user_type", 1, "", `${API_BASE_URL}/stores/${storeId}/find-all-users`)

    if (chosenData.admPermissions) {
      const admPermToPost = new AdmPerm(userData.permissions)
      await postToSaipos(admPermToPost, `${API_BASE_URL}/stores/${storeId}/update-permission`)
    }

    const settingToPut = new Settings()

    if (chosenData.col42) {
      const col42Id = await getFromSaipos("id_setting", 2, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      await putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${col42Id}`)
    }

    if (chosenData.kds) {
      const kdsId = await getFromSaipos("id_setting", 57, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      await putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${kdsId}`)
    }

    if (chosenData.cancelReason) {
      const cancelReasonId = await getFromSaipos("id_setting", 61, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      await putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${cancelReasonId}`)
    }

    if (chosenData.cancelPassword) {
      const cancelPasswordId = await getFromSaipos("id_setting", 62, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      await putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${cancelPasswordId}`)
      const cancPassToPost = new CancPass({ id_user: userData.id_user })
      await postToSaipos(cancPassToPost, `${API_BASE_URL}/stores/${storeId}/update-user`)
    }
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CONFIGURAÇÕES', error)
    return ["CONFIGURAÇÕES: ", { stack: error.stack }]
  }
}

module.exports = settings
