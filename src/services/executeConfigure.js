// Importações das funções de api
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

// Envio de info para a planilha
async function processDataToGoogleSheet(data) {
  data.generalData.time.endTime = new Date()
  data.generalData.time.timestamp = parseFloat((data.generalData.time.endTime - data.generalData.time.startTime) / 1000).toFixed(0)
  data.generalData.time.endTime = await handleDateNow(data.generalData.time.endTime)
  const storeId = data.generalData.storeId

  if (data.generalData.time.timestamp > 0 && storeId != "33738") {
    const jsonData = JSON.stringify(data)
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbw0Bav3zFGj4Cy82MiVVSPWy3I9bjhIAMDPdh9WBbdDQaP_9nREOWbvKGsbM18l7I8r_g/exec'

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
      console.log(`REGISTRO: ${storeId}`)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }
}

// Tratamento de data
async function handleDateNow(end) {
  const day = end.getDate().toString().padStart(2, '0')
  const month = (end.getMonth() + 1).toString().padStart(2, '0')
  const year = end.getFullYear()
  const hours = end.getHours().toString().padStart(2, '0')
  const minutes = end.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// Verificação de existência
async function hasTruthyValue(value) {
  if (typeof value === 'string' && value.length > 0 && !(value.length == 1 && value[0] == ' ') ) {
    return true
  } else if (typeof value === 'boolean' && value) {
    return true
  } else if (Array.isArray(value)) {
    for (const element of value) {
      if (await hasTruthyValue(element)) {
        return true
      }
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const key in value) {
      if (await hasTruthyValue(value[key])) {
        return true
      }
    }
  }
  return false
}

// Execução do módulo
async function executeModule(moduleName, data) {
  let success = false
  if (await hasTruthyValue(data[`${moduleName}Chosen`])) {
    console.log(`EXECUTANDO: ${data.generalData.storeId} | ${moduleName}`)
    const err = await func[moduleName](data[`${moduleName}Chosen`], data.generalData.storeId)
    if (err && err.length > 0) {
      console.log(`ERRO: ${data.generalData.storeId} | ${err[0].slice(0, -2)}`)
    } else {
      success = true
    }
  }
  return { moduleName, success }
}

// Execução da configuração
async function executeConfigure(data) {
  try {
    storeId = data.generalData.storeId
    data.generalData.time.startTime = new Date()
    
    
    const initialModules = ['ifoodIntegration', 'paymentTypes', 'storeData', 'choices', 'settings']
    const moduleResults = {}
    
    const initialPromises = initialModules.map(moduleName => executeModule(moduleName, data))
    const initialResults = await Promise.all(initialPromises)
    initialResults.forEach(result => moduleResults[result.moduleName] = result.success)
    
    const remainingModules = Object.entries(func)
    .filter(([moduleName]) => !initialModules.includes(moduleName))
    .map(([moduleName]) => executeModule(moduleName, data))
    const remainingResults = await Promise.all(remainingModules)
    remainingResults.forEach(result => moduleResults[result.moduleName] = result.success)
    
    
    await processDataToGoogleSheet(data)
    const finalAlert = await createFinalReport(data, moduleResults)
    
    return finalAlert
  } catch (error) {
    console.error('Ocorreu um erro ao CONFIGURAR:', error)
  }
}

function createFinalReport(data, results) {
  const moduleNamesInPortuguese = {
    ifoodIntegration: 'Integração Ifood',
    paymentTypes: 'Formas de pagamento',
    storeData: 'Dados da loja',
    choices: 'Adicionais',
    settings: 'Configurações',
    saleStatus: 'Status de venda',
    tableOrder: 'Mesas',
    orderCard: 'Comandas',
    shifts: 'Turnos',
    waiters: 'Garçons',
    deliveryMen: 'Entregadores',
    users: 'Usuários',
    deliveryAreas: 'Áreas de entrega',
    menu: 'Cardápio',
    partners: 'Canais de venda'
  }
  
  let report = `FIM: ${data.generalData.storeId} | ${data.generalData.time.timestamp} segundos\n\nMÓDULOS CADASTRADOS:\n`
  for (let [module, success] of Object.entries(results)) {
    if (success) { 
      const moduleNameInPortuguese = moduleNamesInPortuguese[module] || module
      report += `${moduleNameInPortuguese}\n`
    }
  }
  return report
}

// Exportações
module.exports = { executeConfigure }