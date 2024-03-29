// Módulos de funções para configurações
const login = require('./functions/login.js')
const paymentTypes = require("./functions/paymentTypes.js")
const users = require("./functions/users.js")
const shifts = require("./functions/shifts.js")
const saleStatus = require("./functions/saleStatus.js")
const tableOrder = require("./functions/tableOrder.js")
const orderCard = require("./functions/orderCard.js")
const settings = require("./functions/settings.js")
const waiters = require("./functions/waiters.js")
const deliveryMen = require("./functions/deliveryMen.js")
const taxesData = require("./functions/taxesData.js")
const menu = require("./functions/menu.js")
const neighborhoods = require("./functions/neighborhoods.js")
const partners = require('./functions/partners.js')
const { ipcRenderer } = require('electron') // Módulo para comunicar com electron
const additionals = require('./functions/additionals.js')
const dotenv = require('dotenv').config()
const saiposAuthToken = process.env.SAIPOS_AUTH_TOKEN

// App Script API
function googleSheetAPI(formData) {
  const jsonData = JSON.stringify(formData)

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
    console.log(`REGISTRADO: ${formData.storeId}`)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

// Função principal
module.exports = async function executeConfigure(formData) {
  try {
    
    // Declaração de variáveis úteis
    let saiposUser = formData.saiposEmail.slice(0, -11)
    formData.errorLog = []

    // Comunicação de Status
    console.log(`INICIADO: ${formData.storeId} | ${saiposUser}`)
    ipcRenderer.send('show-alert', `INICIADO: ${formData.storeId} | ${saiposUser}`)

    // Verificações para chamada das funções
    if (formData.cardFlags || formData.pix) {
      let err = await paymentTypes(saiposAuthToken, formData.cardFlags, formData.pix)
      err != null ? formData.errorLog.push(err) : null
    }
    if (formData.deliverySite || formData.basicMenu || formData.premiumMenu) {
      let err = await partners(saiposAuthToken, formData.deliverySite, formData.storeName, formData.minimumValue, formData.startTime, formData.weekDays, formData.endTime, formData.waiterInstruction, formData.counterInstruction, formData.premiumMenu, formData.basicMenu, formData.cardFlags, formData.pix, formData.counterPickUp)
      err != null ? formData.errorLog.push(err) : null
    }
    if (formData.cancelPassword || formData.cancelReason || formData.col42) {
      let err = await settings(saiposAuthToken, formData.cancelPassword, formData.cancelReason, formData.col42)
      err != null ? formData.errorLog.push(err) : null
    }
    if (formData.waiters || formData.cancelPassword || formData.admPermissions) {
      let err = await users(saiposAuthToken, formData.waiters, formData.storeName, formData.cancelPassword, formData.admPermissions)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.shiftTime[0] !== "") {
      let err = await shifts(saiposAuthToken, formData.serviceFee, formData.shiftTime, formData.shiftDesc)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.saleStatus) {
      let err = await saleStatus(saiposAuthToken, formData.easyDelivery)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.tables) {
      let err = await tableOrder(saiposAuthToken, formData.tables)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.orderCards) {
      let err = await orderCard(saiposAuthToken, formData.orderCards)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.waiters) {
      let err = await waiters(saiposAuthToken, formData.waiters, formData.waitersDailyRate)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.deliveryMen || formData.easyDelivery) {
      let err = await deliveryMen(saiposAuthToken, formData.deliveryMen, formData.deliveryMenDailyRate, formData.easyDelivery)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.drinksCEST) {
      let err = await taxesData(saiposAuthToken)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.neighborhoodsData != undefined) {
      let err = await neighborhoods(saiposAuthToken, formData.neighborhoodsData, formData.storeCity, formData.storeState, formData.storeId)
      err != null ? formData.errorLog.push(err) : null
    } 
    if (formData.additionalsData != undefined) {
      let err = await additionals(saiposAuthToken, formData.additionalsData, formData.storeId, formData.pizzaBigger, formData.pizzaProportional)
      err != null ? formData.errorLog.push(err) : null
    }
    if (formData.menuData != undefined) {
      let err = await menu(saiposAuthToken, formData.menuData, formData.storeId)
      err != null ? formData.errorLog.push(err) : null
    }

    // Finalização
    const end = new Date()
    const timestamp = (end - start) / 60000

    // Comunicação de Status
    console.log(`FINALIZADO: ${formData.storeId} | ${saiposUser}`)
    ipcRenderer.send('show-alert', `FINALIZADO: ${formData.storeId} | ${saiposUser} | ${timestamp.toFixed(0)} minutos`)
    
    // Registro
    formData.timestamp = parseFloat(timestamp).toFixed(0)

    // Tratamento de timestamp
    var now = new Date()
    var day = now.getDate().toString().padStart(2, '0')
    var month = (now.getMonth() + 1).toString().padStart(2, '0')
    var year = now.getFullYear()
    var hours = now.getHours().toString().padStart(2, '0')
    var minutes = now.getMinutes().toString().padStart(2, '0')
    formData.dateNow = `${day}/${month}/${year} ${hours}:${minutes}`
    formData.saiposEmail = saiposUser

    // Chamada de registro da planilha Google
    if (formData.timestamp > 0 && formData.storeId != "33738") {
      googleSheetAPI(formData)
    }

    // Tratemento de erros
  } catch (error) {
    console.error('Ocorreu um erro ao CONFIGURAR:', error)
  }
} 