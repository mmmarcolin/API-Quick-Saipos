const { getFromSaipos, postToSaipos } = require("../requestsToSaipos.js")
const { storeId, API_BASE_URL, normalizeText } = require("../../utils/auxiliarVariables.js")

class User {
  constructor(data) {
    this.id_user = 0
    this.print_to_user = data.full_name == "Caixa" ? null : data.print_to_user
    this.show_sale_notify = data.full_name == "Caixa" ? "Y" : "N"
    this.password = normalizeText(data.full_name)
    this.user_type = data.full_name == "Caixa" ? 1 : 4
    this.full_name = data.full_name
    this.login = `${normalizeText(data.full_name)}@${normalizeText(data.store_name)}.com`
    this.email = `${normalizeText(data.full_name)}@${normalizeText(data.store_name)}.com`
  }
}

async function users(chosenData) {
  try {

    let userToPrintId = null

    if (chosenData.counterUser) {
      const userToPost = new User({
        full_name: "Caixa",
        store_name: chosenData.storeName
      })
      const response = await postToSaipos(userToPost, `${API_BASE_URL}/stores/${storeId}/users`)
      userToPrintId = response.id_user
    } else {
      userToPrintId = await getFromSaipos("user.user_type", 1, "id_user", `${API_BASE_URL}/stores/${storeId}/find-all-users`)
    }

    for (const userName of chosenData.UserDesc) {
      const userToPost = new User({
        full_name: userName,
        store_name: chosenData.storeName,
        print_to_user: userToPrintId
      })
      await postToSaipos(userToPost, `${API_BASE_URL}/stores/${storeId}/users`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de USUÁRIOS', error)
    return ["USUÁRIOS: ", { stack: error.stack }]
  }
}

module.exports = users