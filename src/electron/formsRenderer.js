// Importações do preload.js
const api = window.api
const toggleWindowSize = isVisible => api.toggleWindowSize(isVisible)
const processCSV = (...args) => api.processCSV(...args)
const executeConfigure = (...args) => api.executeConfigure(...args)
const openExternal = url => api.openExternal(url)

document.addEventListener("DOMContentLoaded", function() {

  // Tratar checks de upload
  ['menu', 'delivery-area', 'choices'].forEach(type => {
    const label = document.getElementById(`${type}-label`)
    const removeButton = document.getElementById(`${type}-remove`)
    
    label.addEventListener('change', event => {
      const fileInput = event.target
      removeButton.style.display = fileInput.files.length > 0 ? 'inline' : 'none'
    })

    removeButton.addEventListener('click', () => {
      const fileInput = document.getElementById(`${type}-csv`)
      fileInput.value = '' 
      removeButton.style.display = 'none' 
    })
  })

  // Abrir link
  document.getElementById('doc-button').addEventListener('click', (event) => {
    event.preventDefault()
    const url = event.currentTarget.href
    openExternal(url)
  })

  // Colapsar HTML
  document.getElementById('collapse-button').addEventListener('click', function() {
    var content = document.getElementById('collapsible-content')
    var buttonContainer = document.getElementById('button-container')
    content.classList.toggle('collapsed')
    toggleWindowSize(content.classList.contains('collapsed'))

    content.classList.contains ?
    buttonContainer.classList.add('collapsed') :
    buttonContainer.classList.remove('collapsed')
    
    if (document.getElementById('collapse-button').innerHTML.includes("⇧")) {
      document.getElementById('collapse-button').innerHTML = "⇩"
    } else {
      document.getElementById('collapse-button').innerHTML = "⇧"
    }

    cleanSelection()
  })

  // Limpar seleção
  document.getElementById('clean-button').addEventListener('click', function() {
    cleanSelection()
  })

  // Alterar iluminação
  document.getElementById('dark-light-mode-button').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode')
  })

  // Função para tratar dias da semana
  function processWeekDays(startDay, endDay) {
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const startIndex = weekDays.indexOf(startDay.toLowerCase())
    const endIndex = weekDays.indexOf(endDay.toLowerCase())

    let result = {}
    weekDays.forEach((day, index) => {
      if (startIndex <= endIndex) {
        result[day] = index >= startIndex && index <= endIndex
      } else {
        result[day] = index >= startIndex || index <= endIndex
      }
    })

    return result
  }

  // Função para tratar arrays de funcionários
  function handleWorkers(quantity, dailyRate, worker, cashier) {
    let result = []

    if (typeof quantity === 'string' && quantity.includes(",")) {
      quantity = quantity.split(",").map(item => item.trim())
    } else if (typeof quantity === 'string') {
      quantity = parseInt(quantity, 10)
    }

    if (typeof dailyRate === 'string' && dailyRate.includes(",")) {
      dailyRate = dailyRate.split(",").map(Number)
    } else if (typeof dailyRate === 'string') {
      dailyRate = parseInt(dailyRate, 10)
    }

    let iterations = Array.isArray(quantity) ? quantity.length : quantity

    for (let i = 0; i < iterations; i++) {
        let desc = Array.isArray(quantity) ? quantity[i] : `${worker} ${i + 1}`
      let rate = Array.isArray(dailyRate) ? dailyRate[i] : dailyRate
      if (Array.isArray(dailyRate) && i >= dailyRate.length) {
        rate = 0
      }
      result.push({ desc, dailyRate: rate })
    }

    if (worker === "Garçom" && cashier) {
      result.push({ desc: "Caixa", dailyRate: 0 })
    }

    return result
  }

  // Função para tratar array de ifood
  function processIfoodData(partnersIfoodCodeStr, partnersIfoodNameStr) {
    const partnersIfoodCode = partnersIfoodCodeStr.split(",")
    const partnersIfoodName = partnersIfoodNameStr.split(",")

    return partnersIfoodCode.map((code, index) => ({
      code: code,
      name: partnersIfoodName.length === 1 ? partnersIfoodName[0] : partnersIfoodName[index]
    }))
  }
  
  // Função para tratar array de turnos
  function processShiftData(shiftDescStr, shiftTimeStr, shiftServiceFeeStr) {
    const shiftDesc = shiftDescStr.split(",")
    const shiftTime = shiftTimeStr.split(",")
    const shiftServiceFee = shiftServiceFeeStr.split(",")

    return shiftDesc.map((desc, index) => ({
      desc: desc,
      time: shiftTime.length === 1 ? shiftTime[0] : (shiftTime[index] || ''),
      serviceFee: shiftServiceFee.length === 1 ? shiftServiceFee[0] : (shiftServiceFee[index] || '0')
    }))
  }

  // Função para envio do formulário
  function formSubmitted(formData) {
    ['menu-remove', 'delivery-area-remove', 'choices-remove'].forEach(id => {
      document.getElementById(id).style.display = 'none'
    })  
    document.getElementById("form").reset()

    executeConfigure(formData)
  }

  // Função para limpar seleção
  function cleanSelection() {
    ['menu-remove', 'delivery-area-remove', 'choices-remove'].forEach(id => {
      document.getElementById(id).style.display = 'none'
    })

    document.querySelectorAll('input, select').forEach(element => {
      if (element.type === 'checkbox') {
        element.checked = false;
      } else if (element.tagName === 'SELECT' || element.type === 'text' || element.type === 'number') {
        element.value = ""
      }
    })
  }

  // Completar endereço via cep
  document.getElementById('store-data-zip').addEventListener('input', async function() {
    const cep = this.value
  
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.statusText}`)
        }
        const responseData = await response.json()
        console.log('Response:', responseData)
        document.getElementById('store-data-state').value = responseData.state
        document.getElementById('store-data-city').value = responseData.city
        document.getElementById('store-data-district').value = responseData.neighborhood
        document.getElementById('store-data-address').value = responseData.street
      } catch (error) {
        console.error('Erro ao buscar dados do CEP:', error)
      }
    }
  })

  // Função para sincronizar checkboxes
  function syncCheckboxes(controlId, targets, isGroup = false) {
    const control = document.getElementById(controlId)

    if (isGroup) {
      control.addEventListener('change', () => {
        document.querySelectorAll(targets).forEach(checkbox => {
          checkbox.checked = control.checked
        })
      })

      document.querySelectorAll(targets).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          control.checked = document.querySelectorAll(targets).length ===
                            document.querySelectorAll(`${targets}:checked`).length
        })
      })
    } else {
      control.addEventListener('change', () => {
        const targetCheckbox = document.getElementById(targets)
        targetCheckbox.checked = control.checked
      })
    }
  }
  syncCheckboxes('payment-types-all', '.select-all-pay input[type=checkbox]:not(#payment-types-all)', true)
  syncCheckboxes('config-all', '.select-all-conf input[type=checkbox]:not(#config-all)', true)
  syncCheckboxes('partners-site-delivery', 'partners-counter-pickup')
  syncCheckboxes('partners-premium-digital-menu', 'partners-instruction-counter')

  // Função para concorrer checkboxes
  function toggleExclusiveCheckboxes(id1, id2) {
    const checkbox1 = document.getElementById(id1)
    const checkbox2 = document.getElementById(id2)

    function toggleCheckbox(source, target) {
      source.addEventListener('change', () => {
        if (source.checked && target.checked) {
          target.checked = false
        }
      })
    }

    toggleCheckbox(checkbox1, checkbox2) 
    toggleCheckbox(checkbox2, checkbox1)
  }
  toggleExclusiveCheckboxes("sale-status-left", "sale-status-easy-delivery")
  toggleExclusiveCheckboxes("delivery-area-district", "delivery-area-radius")
  toggleExclusiveCheckboxes("apportionment-proportional", "apportionment-bigger")
  toggleExclusiveCheckboxes("partners-basic-digital-menu", "partners-premium-digital-menu")
  toggleExclusiveCheckboxes("partners-instruction-counter", "partners-instruction-waiter")

// Enviar formulário 
  document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault() 
    try {

      // Recebe dados
      let elementValues = {
        paymentTypesPix: document.getElementById('payment-types-pix').checked,
        paymentTypesMaster: document.getElementById('payment-types-master').checked,
        paymentTypesElo: document.getElementById('payment-types-elo').checked,
        paymentTypesVisa: document.getElementById('payment-types-visa').checked,
        paymentTypesAmex: document.getElementById('payment-types-amex').checked,
        paymentTypesHiper: document.getElementById('payment-types-hiper').checked,
        paymentTypesSodexo: document.getElementById('payment-types-sodexo').checked,
        paymentTypesAlelo: document.getElementById('payment-types-alelo').checked,
        configCol42: document.getElementById('config-col42').checked,
        configPermissions: document.getElementById('config-permissions').checked,
        configCancelPass: document.getElementById('config-cancel-pass').checked,
        configCancelReason: document.getElementById('config-cancel-reason').checked,
        configKds: document.getElementById('config-kds').checked,
        saleStatusLeft: document.getElementById('sale-status-left').checked,
        saleStatusEasyDelivery: document.getElementById('sale-status-easy-delivery').checked,
        userWaiterApp: document.getElementById('user-waiter-app').checked,
        userCashier: document.getElementById('user-cashier').checked,
        deliveryAreaDistrict: document.getElementById('delivery-area-district').checked,
        deliveryAreaRadius: document.getElementById('delivery-area-radius').checked,
        apportionmentProportional: document.getElementById('apportionment-proportional').checked,
        apportionmentBigger: document.getElementById('apportionment-bigger').checked,
        partnersSiteDelivery: document.getElementById('partners-site-delivery').checked,
        partnersCounterPickup: document.getElementById('partners-counter-pickup').checked,
        partnersBasicDigitalMenu: document.getElementById('partners-basic-digital-menu').checked,
        partnersPremiumDigitalMenu: document.getElementById('partners-premium-digital-menu').checked,
        partnersInstructionCounter: document.getElementById('partners-instruction-counter').checked,
        partnersInstructionWaiter: document.getElementById('partners-instruction-waiter').checked,
        partnersStartDay: document.getElementById('partners-start-day').value,
        partnersEndDay: document.getElementById('partners-end-day').value,
        partnersStartTime: document.getElementById('partners-start-time').value,
        partnersEndTime: document.getElementById('partners-end-time').value,
        partnersMinimumValue: document.getElementById('partners-minimum-value').value,
        storeDataState: document.getElementById('store-data-state').value,
        storeDataCity: document.getElementById('store-data-city').value,
        storeDataDistrict: document.getElementById('store-data-district').value,
        storeDataAddress: document.getElementById('store-data-address').value,
        storeDataNumber: document.getElementById('store-data-number').value,
        storeDataZip: document.getElementById('store-data-zip').value,
        storeDataComplement: document.getElementById('store-data-complement').value,
        storeDataCnpj: document.getElementById('store-data-cnpj').value,
        storeDataStateRegistration: document.getElementById('store-data-state-registration').value,
        storeDataCnae: document.getElementById('store-data-cnae').value,
        shiftDesc: document.getElementById('shift-desc').value,
        shiftTime: document.getElementById('shift-time').value,
        shiftServiceFee: document.getElementById('shift-service-fee').value,
        waitersQuantity: document.getElementById('waiters-quantity').value,
        waitersDailyRate: document.getElementById('waiters-daily-rate').value || 0,
        deliveryMenQuantity: document.getElementById('delivery-men-quantity').value,
        deliveryMenDailyRate: document.getElementById('delivery-men-daily-rate').value || 0,
        partnersIfoodCode: document.getElementById('partners-ifood-code').value,
        partnersIfoodName: document.getElementById('partners-ifood-name').value,
        tableOrders: document.getElementById('table-orders').value,
        orderCards: document.getElementById('order-cards').value,
        domain: document.getElementById('domain').value,
        menuCsv: document.getElementById('menu-csv').files[0] || "",
        choicesCsv: document.getElementById('choices-csv').files[0] || "",
        deliveryAreaCsv: document.getElementById('delivery-area-csv').files[0] || "",
        storeId: document.getElementById('store-id').value,
      } 

      // Trata CSV
      elementValues.choicesCsv ? elementValues.choicesCsv = await processCSV(elementValues.choicesCsv.path, ['Área', 'Taxa', 'Entregador']) : null
      elementValues.menuCsv ? elementValues.deliveryAreaCsv = await processCSV(elementValues.menuCsv.path, ['Categoria', 'Produto', 'Preço', 'Descrição', 'Adicional', 'Código']) : null
      elementValues.deliveryAreaCsv ? elementValues.deliveryAreaCsv = await processCSV(elementValues.deliveryAreaCsv.path, ['Adicional', 'Item', 'Preço', 'Descrição', 'Quantidade', 'Código']) : null

      // Trata dias da semana
      elementValues.weekDays = await processWeekDays(elementValues.partnersStartDay, elementValues.partnersEndDay)

      // Trata tipo de entrega
      elementValues.deliveryAreaRadius === true ? elementValues.deliveryOption = "A" : 
      elementValues.deliveryAreaDistrict === true ? elementValues.deliveryOption = "D" : ""

      // Trata arrays
      elementValues.deliveryMen = await handleWorkers(elementValues.deliveryMenQuantity, elementValues.deliveryMenDailyRate, "Entregador")
      elementValues.users = await handleWorkers(elementValues.waitersQuantity, elementValues.waitersDailyRate, "Garçom", elementValues.userCashier)
      elementValues.ifood = await processIfoodData(elementValues.partnersIfoodCode, elementValues.partnersIfoodName)
      elementValues.shifts = await processShiftData(elementValues.shiftDesc, elementValues.shiftTime, elementValues.shiftServiceFee)
console.log(elementValues.users)
      const formData = {
        paymentTypesChosen: {
          pix: elementValues.paymentTypesPix,
          elo: elementValues.paymentTypesElo,
          master: elementValues.paymentTypesMaster,
          visa: elementValues.paymentTypesVisa,
          amex: elementValues.paymentTypesAmex,
          hiper: elementValues.paymentTypesHiper,
          sodexo: elementValues.paymentTypesSodexo,
          alelo: elementValues.paymentTypesAlelo,
        },
        settingsChosen: {
          col42: elementValues.configCol42,
          kds: elementValues.configKds,
          cancelReason: elementValues.configCancelReason,
          cancelPassword: elementValues.configCancelPass,
          admPermissions: elementValues.configPermissions
        },
        saleStatusChosen: {
          delivery: elementValues.saleStatusLeft,
          easyDelivery: elementValues.saleStatusEasyDelivery
        },
        tableOrderChosen: {
          quantity: elementValues.tableOrders
        },
        orderCardChosen: {
          quantity: elementValues.orderCards
        },
        storeDataChosen: {
          cnae: elementValues.storeDataCnae,
          state: elementValues.storeDataState,
          city: elementValues.storeDataCity,
          district: elementValues.storeDataDistrict,
          zipCode: elementValues.storeDataZip,
          address: elementValues.storeDataAddress,
          addressNumber: elementValues.storeDataNumber,
          addressComplement: elementValues.storeDataComplement,
          stateReg: elementValues.storeDataStateRegistration,
          cnpj: elementValues.storeDataCnpj,
          deliveryOption: elementValues.deliveryOption
        },
        partnersChosen: {
          deliverySite: elementValues.partnersSiteDelivery,
          basicMenu: elementValues.partnersBasicDigitalMenu,
          premiumMenu: elementValues.partnersPremiumDigitalMenu,
          pickupCounter: elementValues.partnersCounterPickup,
          domain: elementValues.domain,
          partnersMinimumValue: elementValues.partnersMinimumValue,
          startTime: elementValues.partnersStartTime,
          endTime: elementValues.partnersEndTime,
          weekDays: elementValues.weekDays
        },
        usersChosen: {
          users: elementValues.users,
          storeName: elementValues.domain
        },
        ifoodIntegrationChosen: elementValues.ifood,
        shiftsChosen: elementValues.shifts,
        deliveryMenChosen: elementValues.deliveryMen,
        waitersChosen: elementValues.users,
        deliveryAreasChosen: elementValues.deliveryAreaCsv,
        choicesChosen: elementValues.choicesCsv,
        menuChosen: elementValues.menuCsv,
        storeId: elementValues.storeId,
        time: {},
      }

      // checkAndHandleValues(formData) ? console.log("Valor inválido encontrado") : 
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      // ? console.log("Valor inválido encontrado") :
      console.log(formData)

// se marcado dia IntersectionObserver, fim, horario incio , fim, minimo, retirada, tem que amrcar site delivery
// se marcar


      // formSubmitted(formData)
    } catch (error) {
      console.error('Ocorreu um erro ao enviar o FORMULÁRIO:', error) 
    }
  })
})