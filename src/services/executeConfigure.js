const { formData } = require("../utils/auxiliarVariables.js")

// Carregar módulos de funções
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

// App Script API
async function processDataToGoogleSheet(data) {
  data.time.endTime = new Date()
  data.time.timestamp = parseFloat((data.time.endTime - data.time.startTime) / 1000).toFixed(0)
  data.time.endTime = await handleDateNow(data.time.endTime)
  if (data.time.timestamp > 0 && data.storeId !== "33738") {
    const jsonData = JSON.stringify(data)
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwHy4Ttcql8TXzcSMvzrsXHyymj_LSHdiphm6ieLsWlIiSwq_RMVkTapsyvJwOZZaJu/exec';
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

// Tratamento de timestamp
async function handleDateNow(end) {
  var day = end.getDate().toString().padStart(2, '0')
  var month = (end.getMonth() + 1).toString().padStart(2, '0')
  var year = end.getFullYear()
  var hours = end.getHours().toString().padStart(2, '0')
  var minutes = end.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// Verificador de existência
async function hasTruthyValue(obj) {
  function isTruthy(value) {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    if (typeof value === 'string') return value.length > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(isTruthy)
    }
    return false
  }
  return Object.values(obj).some(isTruthy)
}

// Comunicação de Status
async function logAndSendAlert(message) {
  console.log(message)
  // ipcRenderer.send('show-alert', message);
}

// Função de execução do cadastro
async function executeConfigure(data) {
  try {
    
    // Início
    await logAndSendAlert(`INICIADO: ${data.storeId}`)
    
    data.time.startTime = new Date()
    data.errorLog = []

    // Executando cada função e armazenando o retorno no errorLog
    for (const [moduleName, moduleFunction] of Object.entries(func)) {
      const isChosen = await hasTruthyValue(data[`${moduleName}Chosen`])
      isChosen ? console.log(isChosen, ": ", moduleName) : null
      if (isChosen) {
        const err = await moduleFunction(data[`${moduleName}Chosen`])
        if (err && err.length > 0) {
          data.errorLog.push({ moduleName, err })
        }
      }
    }

    // Final
    await processDataToGoogleSheet(data)
    await logAndSendAlert(`FINALIZADO: ${data.storeId} | ${data.time.timestamp} segundos`)
    
    // Tratemento de erros
  } catch (error) {
    console.error('Ocorreu um erro ao CONFIGURAR:', error)
  }
} 

executeConfigure(formData)