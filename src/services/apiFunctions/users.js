const { getFromSaipos, postToSaipos } = require("../requestsToSaipos.js")
const{ API_BASE_URL, normalizeText } = require("../../utils/auxiliarVariables.js")


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

async function users(chosenData, storeId) {
  try {

    let userToPrintId = null


    if (chosenData.users.some(item => item.desc === 'Caixa')) {
      const userToPost = new User({
        full_name: "Caixa",
        store_name: chosenData.domain
      })
      const response = await postToSaipos(userToPost, `${API_BASE_URL}/stores/${storeId}/users`)
      userToPrintId = response.id_user
      chosenData.users = chosenData.users.filter(user => user.desc !== 'Caixa')
    } else {
      userToPrintId = await getFromSaipos("user", 1, "id_user", `${API_BASE_URL}/stores/${storeId}/find-all-users`, "user_type")
    }

    let promises
    if (chosenData.users.length > 0 ) {
      promises = chosenData.users.map(usersData => {
        console.log(usersData)
        const userToPost = new User({
          full_name: usersData.desc,
          store_name: chosenData.domain,
          print_to_user: userToPrintId
        })
      return postToSaipos(userToPost, `${API_BASE_URL}/stores/${storeId}/users`)
      })
      await Promise.all(promises)
    }
  
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de USUÁRIOS', error)
    return ["USUÁRIOS: ", { stack: error.stack }]
  }
}

module.exports = users