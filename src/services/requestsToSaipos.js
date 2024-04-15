const { normalizeText } = require('../utils/auxiliarVariables')
let saiposAuthToken = ''

function setToken(token) {
  saiposAuthToken = token
}

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
  return options
}

async function makeFetchRequest(url, options) {
  try {
    console.log(options)
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(response.status)
    }
    const responseData = await response.json()
    // options.method !== 'GET' ? console.log('Response:', responseData) : null
    return responseData
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

async function postToSaipos(data, url) {
  // console.log(data)
  return makeFetchRequest(url, createRequestOptions('POST', data))
}

async function putToSaipos(data, url) {
  // console.log(data)
  return makeFetchRequest(url, createRequestOptions('PUT', data))
}

async function getFromSaipos(keyToFind, desiredValue, keyToReturn, url, extraPropertyToFind = null, extraPropertyToReturn = null) {
  const responseData = await makeFetchRequest(url, createRequestOptions('GET'))
  let result
  if (!responseData) {
    return null
  }
  // console.log(responseData)
  if (Array.isArray(responseData)) {
    // result = responseData.find(res => console.log(normalizeText(res[keyToFind]), normalizeText(desiredValue)))
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

  // console.log(keyToReturn, ': ', result)
  return result   
}

async function deleteFromSaipos(url) {
  return makeFetchRequest(url, createRequestOptions('DELETE'))
}

module.exports = { postToSaipos, getFromSaipos, putToSaipos, deleteFromSaipos, setToken }