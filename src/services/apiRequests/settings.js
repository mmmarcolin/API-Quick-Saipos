module.exports = async function settings(saiposAuthToken, storeId, chsd) {
  try {

    async function getSettingId(desiredId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/setting_values`
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
        console.log(('Response:', responseData.find(item => item.id_setting === desiredId)).id_store_setting_value)
        
        const desiredSetting = responseData.find(item => item.id_setting === desiredId)
    
        return desiredSetting.id_store_setting_value
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function getUserData() {
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
        return userData
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function putSettings(desiredSetting, settingValue) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/setting_values/${desiredSetting}`
      const data = {
        "setting_value": settingValue
      }
      const options = {
        method: 'PUT',
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
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    async function postCancellationPassword(userData) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/update-user`      
      const data = {
          "id_user": userData.id_user,
          "cancellation_password": "123"
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
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    async function postPermissions(userData) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/update-permission`
      userData.user.permissions.forEach(function(permission) {
        if (permission.allowed === "N") {
          permission.allowed = "S"
        }
      })

      const options = {
        method: 'POST',
        body: JSON.stringify(userData.user.permissions),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    const col42Id = await getSettingId(2)
    const kdsId = await getSettingId(57)
    const cancelReasonId = await getSettingId(61)
    const cancelPasswordId = await getSettingId(62)
    const userData = await getUserData(62)

    if (chsd.col42) { await putSettings(col42Id, 42) } 
    if (chsd.kds) { await putSettings(kdsId, 1) } 
    if (chsd.admPermissions) { await postPermissions(userData) }
    if (chsd.cancelReason) { await putSettings(cancelPasswordId, 1) } 
    if (chsd.cancelPassword) { 
      await putSettings(cancelReasonId, 1)
      setTimeout(() => postCancellationPassword(userData), 500)
    } 

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CONFIGURAÇÕES', error)
    return  ["CONFIGURAÇÕES: ",{ stack: error.stack }]
  }
}