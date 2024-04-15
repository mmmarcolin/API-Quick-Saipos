const { getFromSaipos, postToSaipos, putToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Settings {
  constructor(data) {
    this.setting_value = data
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

async function settings(chosenData, storeId) {
  try {

    const userData = await getFromSaipos("user", 1, "user", `${API_BASE_URL}/stores/${storeId}/find-all-users`, "user_type")
    const operations = []
    console.log(userData)
    if (chosenData.admPermissions) {
      const admPermToPost = new AdmPerm(userData.permissions)
      operations.push(postToSaipos(admPermToPost.permissions, `${API_BASE_URL}/stores/${storeId}/update-permission`))
    }

    if (chosenData.col42) {
      const settingToPut = new Settings("42")
      const col42Id = await getFromSaipos("id_setting", 2, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      operations.push(putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${col42Id}`))
    }

    if (chosenData.kds) {
      const settingToPut = new Settings("1")
      const kdsId = await getFromSaipos("id_setting", 57, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      operations.push(putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${kdsId}`))
    }

    if (chosenData.cancelReason) {
      const settingToPut = new Settings("1")
      const cancelReasonId = await getFromSaipos("id_setting", 61, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      await putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${cancelReasonId}`)
    }

    if (chosenData.cancelPassword) {
      const settingToPut = new Settings("1")
      const cancelPasswordId = await getFromSaipos("id_setting", 62, "id_store_setting_value", `${API_BASE_URL}/stores/${storeId}/setting_values`)
      operations.push(putToSaipos(settingToPut, `${API_BASE_URL}/stores/${storeId}/setting_values/${cancelPasswordId}`))
      const cancPassToPost = new CancPass({ id_user: userData.id_user })
      operations.push(postToSaipos(cancPassToPost, `${API_BASE_URL}/stores/${storeId}/update-user`))
    }

    await Promise.all(operations)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CONFIGURAÇÕES', error)
    return ["CONFIGURAÇÕES: ", { stack: error.stack }]
  }
}

module.exports = settings
