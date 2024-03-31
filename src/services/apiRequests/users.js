module.exports = async function users(saiposAuthToken, storeId, chsd) {
  try {

    async function postUsers(userEmail, userName, userToPrintId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/users/`
      const data = {
        "id_user": 0,
        "print_to_user": userEmail.split('@')[0] == "caixa" ? null : userToPrintId,
        "show_sale_notify": userEmail.split('@')[0] == "caixa" ? "Y" : "N",
        "password": userEmail.split('@')[0],
        "user_type": userEmail.split('@')[0] == "caixa" ? 1 : 4,
        "full_name": userName,
        "email": userEmail,
        "login": userEmail,
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData.id_user
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }
    
    async function getUserId() {
      const url = `https://api.saipos.com/v1/stores/${storeId}/find-all-users`
      const options = {
        method: 'GET',
        headers: {
          'Authorization': saiposAuthToken,
          'Content-Type': 'application/json'
        }
      }
    
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`)
        }
        const responseData = await response.json()
        const userData = responseData.find(user => user.user.user_type === 1)
        console.log('Response:', userData)
        return userData.id_user
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    let userToPrintId = await getUserId()

    if (chsd.counterUser) {
      userToPrintId = await postUsers(`caixa@${chsd.storeName}.com`, "Caixa") 
    }

    for (let i = 1; i <= chsd.waiterUserQuantity; i++) {
      await postUsers(`atendente${i}@${chsd.storeName}.com`, `Garçom ${i}`, userToPrintId)
    }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de USUÁRIOS', error)
    return  ["USUÁRIOS: ",{ stack: error.stack }]
  }
}