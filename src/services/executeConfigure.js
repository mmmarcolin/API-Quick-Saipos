const { formData } = require("../utils/auxiliarVariables.js")

const func = {
  ifoodIntegration: require('./apiFunctions/ifoodIntegration.js'),
  saleStatus: require("./apiFunctions/saleStatus.js"),
  tableOrder: require("./apiFunctions/tableOrder.js"),
  orderCard: require("./apiFunctions/orderCard.js"),
  settings: require("./apiFunctions/settings.js"),
  storeData: require("./apiFunctions/storeData.js"),
  shifts: require("./apiFunctions/shifts.js"),
  waiters: require("./apiFunctions/waiters.js"),
  deliveryMen: require("./apiFunctions/deliveryMen.js"),
  users: require("./apiFunctions/users.js"),
  deliveryAreas: require("./apiFunctions/deliveryAreas.js"),
  choices: require('./apiFunctions/choices.js'),
  menu: require("./apiFunctions/menu.js"),
  paymentTypes: require("./apiFunctions/paymentTypes.js"),
  partners: require('./apiFunctions/partners.js')
}

async function processDataToGoogleSheet(data) {
  data.time.endTime = new Date()
  data.time.timestamp = parseFloat((data.time.endTime - data.time.startTime) / 1000).toFixed(0)
  data.time.endTime = await handleDateNow(data.time.endTime)
  
  if (data.time.timestamp > 0 && data.storeId !== "33738") {
    const jsonData = JSON.stringify(data)
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwHy4Ttcql8TXzcSMvzrsXHyymj_LSHdiphm6ieLsWlIiSwq_RMVkTapsyvJwOZZaJu/exec'

    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text()
    })
    .then(data => {
      console.log(`REGISTRADO: ${data.storeId}`)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }
}

async function handleDateNow(end) {
  const day = end.getDate().toString().padStart(2, '0')
  const month = (end.getMonth() + 1).toString().padStart(2, '0')
  const year = end.getFullYear()
  const hours = end.getHours().toString().padStart(2, '0')
  const minutes = end.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

async function hasTruthyValue(obj) {
  return Object.values(obj).some(value => 
    Boolean(value) && (typeof value !== 'object' || Object.values(value).length > 0)
  )
}

async function logAndSendAlert(message) {
  console.log(message)
  // ipcRenderer.send('show-alert', message)
}

async function executeModule(moduleName, data) {
  if (await hasTruthyValue(data[`${moduleName}Chosen`])) {
    console.log(true, ": ", moduleName)
    const err = await func[moduleName](data[`${moduleName}Chosen`])
    if (err && err.length > 0) {
      data.errorLog.push({ moduleName, err })
    }
  }
}

async function executeConfigure(data) {
  try {
    await logAndSendAlert(`INICIADO: ${data.storeId}`)
    
    data.time.startTime = new Date()
    data.errorLog = []

    const initialModules = ['ifoodIntegration', 'paymentTypes', 'storeData', 'choices', 'settings']
    const initialPromises = initialModules.map(moduleName => executeModule(moduleName, data))

    await Promise.all(initialPromises)

    const remainingModules = Object.entries(func)
      .filter(([moduleName]) => !initialModules.includes(moduleName))
      .map(([moduleName]) => executeModule(moduleName, data))

    await Promise.all(remainingModules)

    await processDataToGoogleSheet(data)
    await logAndSendAlert(`FINALIZADO: ${data.storeId} | ${data.time.timestamp} segundos`)
  } catch (error) {
    console.error('Ocorreu um erro ao CONFIGURAR:', error)
  }
}

module.exports = executeConfigure