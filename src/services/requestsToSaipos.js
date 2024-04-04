require('dotenv').config()
const saiposAuthToken = process.env.SAIPOS_AUTH_TOKEN
const { normalizeText } = require('../utils/auxiliarVariables')

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
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const responseData = await response.json()
    options.method !== 'GET' ? console.log('Response:', responseData) : null
    return responseData
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

async function postToSaipos(data, url) {
  return makeFetchRequest(url, createRequestOptions('POST', data))
}

async function putToSaipos(data, url) {
  return makeFetchRequest(url, createRequestOptions('PUT', data))
}

async function getFromSaipos(keyToFind, desiredValue, keyToReturn, url) {
  const responseData = await makeFetchRequest(url, createRequestOptions('GET'))
  if (!responseData) {
    return null
  }
  const result = responseData.find(res => normalizeText(res[keyToFind]) === normalizeText(desiredValue))
  if (!result) {
    console.error('Item not found')
    return null
  }
  console.log('Response:', result[keyToReturn])
  return result[keyToReturn]
}

module.exports = { postToSaipos, getFromSaipos, putToSaipos }