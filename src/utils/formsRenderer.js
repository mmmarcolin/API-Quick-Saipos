// Importações do preload.js
const mappings = window.api.getMappings()
function toggleWindowSize(isVisible) {
  window.api.toggleWindowSize(isVisible)
}
function processCSV(...args) {
  window.api.processCSV(...args)
}
function executeConfigure(...args) {
  window.api.executeConfigure(...args)
}
function openExternal(url) {
  window.api.openExternal(url)
}

// Função para ajustar tamanho dos arrays
function adjustArraySize(array, count) {
  if (typeof count === 'object') {
    count = count.length
  } 
  if (count > 1 && array.length === 1 && array[0] !== "") {
    for (let i = 1; i < count; i++) {
      array.push(array[0])
    }
  }
}

// Função para processar os dias selecionados
function ProcessWeekDays(startDay, endDay) {
  let arraySelectedDays = [false, false, false, false, false, false, false]
  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
z
  // Verifica se os dias estão definidos e válidos
  if (startDay && weekDays.indexOf(startDay) !== -1 && endDay && weekDays.indexOf(endDay) !== -1) {
    let indexStartDay = weekDays.indexOf(startDay);
    let indexEndDay = weekDays.indexOf(endDay);

    // Marca os dias selecionados no array
    for (let i = indexStartDay; i != indexEndDay; i = (i + 1) % 7) {
      arraySelectedDays[i] = true
    }
    arraySelectedDays[indexEndDay] = true // Marca o último dia
  }
  return arraySelectedDays
}

// Função chamada quando o formulário é submetido
function formSubmitted(formData) {
  ['menu-remove', 'delivery-area-remove', 'choices-remove'].forEach(id => {
    document.getElementById(id).style.display = 'none'
  })  
  document.getElementById("form").reset()

  executeConfigure(formData)
}

// Abrir links externamente
document.getElementById('doc-button').addEventListener('click', (event) => {
  event.preventDefault()
  const url = event.currentTarget.href
  openExternal(url)
})

// Função para colapsar
const collapseButton = document.getElementById('collapse-button')
collapseButton.addEventListener('click', function() {
  var content = document.getElementById('collapsible-content')
  var buttonContainer = document.getElementById('button-container')
  content.classList.toggle('collapsed')
  toggleWindowSize(content.classList.contains('collapsed'))

  content.classList.contains ?
  buttonContainer.classList.add('collapsed') :
  buttonContainer.classList.remove('collapsed')

  cleanSelection()

  if (collapseButton.innerHTML.includes("⇧")) {
    collapseButton.innerHTML = "⇩"
  } else {
    collapseButton.innerHTML = "⇧"
  }
})

// Chamada para limpar seleção
document.getElementById('clean-button').addEventListener('click', cleanSelection)

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

// Função para automatizar checkboxes

// Função para desmarcar checkboxes concorrentes

// Ouve o evento de carregamento do DOM 
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault() 
    try {

      const elementValues = {
        paymentTypesPix: document.getElementById('payment-types-pix').checked,
        paymentTypesMaster: document.getElementById('payment-types-master').checked,
        paymentTypesElo: document.getElementById('payment-types-elo').checked,
        paymentTypesVisa: document.getElementById('payment-types-visa').checked,
        paymentTypesHiper: document.getElementById('payment-types-hiper').checked,
        paymentTypesSodexo: document.getElementById('payment-types-sodexo').checked,
        paymentTypesAlelo: document.getElementById('payment-types-alelo').checked,
        paymentTypesVa: document.getElementById('payment-types-va').checked,
        paymentTypesVr: document.getElementById('payment-types-vr').checked,
        configCol42: document.getElementById('config-col42').checked,
        configPermissions: document.getElementById('config-permissions').checked,
        configCancelPass: document.getElementById('config-cancel-pass').checked,
        configCancelReason: document.getElementById('config-cancel-reason').checked,
        configKds: document.getElementById('config-kds').checked,
        saleStatusLeft: document.getElementById('sale-status-left').checked,
        saleStatusWaiting: document.getElementById('sale-status-waiting').checked,
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
        storeDataStoreState: document.getElementById('store-data-store-state').value,
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
        waitersDailyRate: document.getElementById('waiters-daily-rate').value,
        deliveryMenQuantity: document.getElementById('delivery-men-quantity').value,
        deliveryMenDailyRate: document.getElementById('delivery-men-daily-rate').value,
        partnersIfoodCode: document.getElementById('partners-ifood-code').value,
        partnersIfoodName: document.getElementById('partners-ifood-name').value,
        tableOrders: document.getElementById('table-orders').value,
        orderCards: document.getElementById('order-cards').value,
        minimumValueDomain: document.getElementById('minimum-value-domain').value,
        menuCsv: document.getElementById('menu-csv').files[0],
        choicesCsv: document.getElementById('choices-csv').files[0],
        deliveryAreaCsv: document.getElementById('delivery-area-csv').files[0],
        storeId: document.getElementById('store-id').value,
      } 

      // Chama a função que transforma arquivos CSV em arrays, se existirem os arquivos
      if (elementValues.choicesCsv) {
        elementValues.choicesCsv = await processCSV(choicesCSVFile.path, ['Bairro', 'Taxa', 'Entregador'], mappings.choicesMappings)
      }
      if (elementValues.menuCsv) {
        elementValues.menuData = await processCSV(menuCSVFile.path, ['Categoria', 'Produto', 'Preço', 'Descrição', 'Adicional', 'Código'], mappings.menuMappings)
      }
      if (elementValues.deliveryAreaCsv) {
        elementValues.deliveryAreaData = await processCSV(deliveryAreaCSVFile.path, ['Adicional', 'Item', 'Preço', 'Descrição', 'Quantidade', 'Código'], mappings.deliveryAreasMappings)
      }

      // Ajuste dos tamanhos de arrays
      // adjustArraySize(formData.waitersDailyRate, formData.waiters)
      // adjustArraySize(formData.deliveryMenDailyRate, formData.deliveryMen)
      // adjustArraySize(formData.serviceFee, formData.shiftDesc)

      const  formData = {

      }



      // Conferências de envio
        formSubmitted(formData)
    } catch (error) {
      console.error('Ocorreu um erro ao enviar o FORMULÁRIO:', error) 
    }
  })
})