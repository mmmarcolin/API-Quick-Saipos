// Importações
const { normalizeText } = require('../utils/auxiliarVariables')

// Setar token
let saiposAuthToken = ''
function setToken(token) {
  saiposAuthToken = token
}

// Criar request base
function createRequestOptions(method, data = null) {
  const options = {
    method: method,
    headers: {
      'Authorization': saiposAuthToken,
      'Content-Type': 'application/json'
    }
  }
  if (data) {
    options.body = JSON.stringify(data)
  }
  console.log(options)
  return options
}

// Criar requisição
async function makeFetchRequest(url, options) {
  try {
    const response = await fetch(url, options)
    console.log(options)
    console.log(url)
    if (!response.ok) {
      throw new Error(response.status)
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Direcionar POST
async function postToSaipos(data, url) {
  return makeFetchRequest(url, createRequestOptions('POST', data))
}

// Direcionar PUT
async function putToSaipos(data, url) {
  return makeFetchRequest(url, createRequestOptions('PUT', data))
}

// Direcionar DELETE
async function deleteFromSaipos(url) {
  return makeFetchRequest(url, createRequestOptions('DELETE'))
}

// Direcionar GET
async function getFromSaipos(keyToFind, desiredValue, keyToReturn, url, extraPropertyToFind = null, extraPropertyToReturn = null) {
  const responseData = await makeFetchRequest(url, createRequestOptions('GET'))
  let result
  if (!responseData) {
    return null
  }
  if (Array.isArray(responseData)) {
    result = responseData.find(res => console.log(normalizeText(res[keyToFind]), normalizeText(desiredValue)))
    extraPropertyToFind ?
    result = responseData.find(res => normalizeText(res[keyToFind][extraPropertyToFind]) === normalizeText(desiredValue)) :
    result = responseData.find(res => normalizeText(res[keyToFind]) === normalizeText(desiredValue)) 
  } else {
    result = responseData
  }

  if (!result) {
    console.error(keyToReturn, ' not found')
    return null
  }

  result = extraPropertyToReturn == "id_store_taxes_data_cfop" ? result = result[keyToReturn][0][extraPropertyToReturn] :
  result = extraPropertyToReturn != null ? result[keyToReturn][extraPropertyToReturn] :
  result = keyToReturn != null ? result[keyToReturn] : result

  console.log(keyToReturn, ': ', result)
  return result   
}

// Exportações
module.exports = { postToSaipos, getFromSaipos, putToSaipos, deleteFromSaipos, setToken }