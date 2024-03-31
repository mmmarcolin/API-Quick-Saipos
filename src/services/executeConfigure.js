// Carregar módulos gerais
// const { ipcRenderer } = require('electron')
require('dotenv').config()

// Definição do token da API
const saiposAuthToken = process.env.SAIPOS_AUTH_TOKEN

// Carregar módulos de funções
const func = {
  paymentTypes: require("./paymentTypes.js"),
  saleStatus: require("./saleStatus.js"),
  tableOrder: require("./tableOrder.js"),
  orderCard: require("./orderCard.js"),
  settings: require("./settings.js"),
  partners: require('./partners.js'),
  taxesData: require("./taxesData.js"),
  shifts: require("./shifts.js"),
  waiters: require("./waiters.js"),
  deliveryMen: require("./deliveryMen.js"),
  users: require("./users.js"),
  neighborhoods: require("./neighborhoods.js"),
  // menu: require("./functions/menu.js"),
  // additionals: require('./functions/additionals.js')
}

// App Script API
async function processDataAndSendToGoogleSheet(data) {
  data.endTime = new Date()
  data.timestamp = parseFloat((data.endTime - data.startTime) / 1000).toFixed(0)
  data.endTime = await handleDateNow(data.endTime)
  if (data.timestamp > 0 && data.storeId !== "33738") {
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
  return Object.values(obj).some(value => {
    if (
      typeof value === 'boolean' && value === true ||
      typeof value === 'number' && value > 0 ||
      Array.isArray(value) && value != 0
      ) {
      return true
    }
    return false
  })
}

// Comunicação de Status
async function logAndSendAlert(message) {
  console.log(message);
  // ipcRenderer.send('show-alert', message);
}

// Função de execução do cadastro
async function executeConfigure(data) {
  try {
    
    // Início
    await logAndSendAlert(`INICIADO: ${data.storeId}`)
    data.startTime = new Date()
    data.errorLog = []

    // Executando cada função e armazenando o retorno no errorLog
    for (const [moduleName, moduleFunction] of Object.entries(func)) {
      const isChosen = await hasTruthyValue(data[`${moduleName}Chosed`])
      if (isChosen) {
        const err = await moduleFunction(saiposAuthToken, data.storeId, data[`${moduleName}Chosed`])
        if (err && err.length > 0) {
          data.errorLog.push({ moduleName, err })
        }
      }
    }

    // Final
    await processDataAndSendToGoogleSheet(data)
    await logAndSendAlert(`FINALIZADO: ${data.storeId} | ${data.timestamp} segundos`)
    
    // Tratemento de erros
  } catch (error) {
    console.error('Ocorreu um erro ao CONFIGURAR:', error)
  }
} 

// Declaração temporária de objeto
const formData = {
  storeId: 33738,
  paymentTypesChosed: {pix: false, elo: false, master: false, visa: false, amex: false, hiper: false},
  partnersChosed: {deliverySite: false, basicMenu: false, premiumMenu: false, pickupCounter: "", storeName: "", minimumValue: 0, startTime: "12:10", endTime: "13:20", weekDays: { sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false }},
  settingsChosed: {col42: false, kds: false, cancelReason: false, cancelPassword: false, admPermissions: false},
  saleStatusChosed: {delivery: false, easyDelivery: false},
  tableOrderChosed: {quantity: 0},
  orderCardChosed: {quantity: 0},
  taxesDataChosed: {cest: false, contigency: false},
  shiftsChosed: {shiftDesc: [], shiftTime: [], shiftCharge: []},
  waitersChosed: {waiterDesc: [], waiterDailyRate: []},
  deliveryMenChosed: {deliveryMenQuantity: [], deliveryMenDailyRate: []},
  usersChosed: {counterUser: false, waiterUserQuantity: 0, storeName: ""},
  neighborhoodsChosed: {},
  additionalsChosed: {},
  menuChosed: {}
}

executeConfigure(formData)