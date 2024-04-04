const fs = require('fs') // Módulo para lidar com sistema de arquivos
const path = require('path') // Módulo para lidar com caminhos de arquivos
const csv = require('csv-parser') // Módulo para analisar arquivos CSV
const { ipcRenderer, shell } = require('electron') // Módulo para comunicação com o processo principal do Electron
const executeConfigure = require('../services/executeConfigure') // Módulo para chamar função de execução do Puppeteer
const { choicesMappings, menuMappings, districtsMappings, processCSV } = require('./functions/csvHandle')

// Declare a variável filePath no escopo global
let filePath

// Envia uma mensagem para o processo principal para obter o caminho da pasta de documentos do usuário
ipcRenderer.send('get-documents-path')

// Ouve a resposta do processo principal
ipcRenderer.on('documents-path', (event, documentsPath) => {
  filePath = path.join(documentsPath, 'login.json')
  startLogin()
})

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

// Abrir links externamente
document.addEventListener('DOMContentLoaded', function() {
  
  const link = document.querySelector('a')
  link.addEventListener('click', function(event) {
    event.preventDefault() // Impede o comportamento padrão do link
    shell.openExternal(this.href) // Abre o link externamente no navegador padrão
  })
})

// Função para remover arquivos dos botões

// Seleciona os elementos
const menuLabel = document.getElementById('menu-label')
const districtsLabel = document.getElementById('districts-label')
const choicesLabel = document.getElementById('choices-label')

// Adiciona event listener para cada label
menuLabel.addEventListener('change', handleFileChange.bind(null, 'menu'))
districtsLabel.addEventListener('change', handleFileChange.bind(null, 'districts'))
choicesLabel.addEventListener('change', handleFileChange.bind(null, 'choices'))

// Função para lidar com a mudança de arquivo
function handleFileChange(type, event) {
  const fileInput = event.target
  const removeSpan = document.getElementById(`${type}-remove`)

  if (fileInput.files.length > 0) {
    removeSpan.style.display = 'inline'
  } else {
    removeSpan.style.display = 'none'
  }
}

// Adiciona evento de clique para remover o arquivo
document.getElementById('menu-remove').addEventListener('click', removeFile.bind(null, 'menu'))
document.getElementById('districts-remove').addEventListener('click', removeFile.bind(null, 'districts'))
document.getElementById('choices-remove').addEventListener('click', removeFile.bind(null, 'choices'))

// Função para remover o arquivo
function removeFile(type) {
  const fileInput = document.getElementById(`${type}-csv`)
  const removeSpan = document.getElementById(`${type}-remove`)

  fileInput.value = '' // Limpa a seleção do arquivo
  removeSpan.style.display = 'none' // Esconde o "X"
}

// Função chamada quando o formulário é submetido
function formSubmitted(formData) {

  // Remoção dos spans de arquivos
  document.getElementById('menu-remove').style.display = 'none'
  document.getElementById('districts-remove').style.display = 'none'
  document.getElementById('choices-remove').style.display = 'none'

  // Finalização
  document.getElementById("form").reset()
  startLogin()
  executeConfigure(formData)
}

// Colapsar janela
function toggleWindowSize(isVisible) {
  const { ipcRenderer } = require('electron');
  // Envia um sinal para o Electron para alternar o tamanho da janela
  ipcRenderer.send('toggle-window-size', !isVisible);
}

// Função para colapsar
document.getElementById('form-logo').onclick = function() {
  var content = document.getElementById('collapsible-content')
  content.classList.toggle('collapsed')
  toggleWindowSize(content.classList.contains('collapsed'))

  var form = document.getElementById('form') 
  var checkboxes = form.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false
  })
}

// Função para preencher os campos de e-mail e senha com dados salvos
function startLogin() {
  const form = document.getElementById("form")
  const saiposEmailInput = document.getElementById("saipos-email")
  const saiposPasswordInput = document.getElementById("saipos-password")

  // Checa se já exite um registro
  if (fs.existsSync(filePath)) {
    const jsonData = fs.readFileSync(filePath, 'utf8')
    const login = JSON.parse(jsonData)
    saiposEmailInput.value = login.saiposEmail
    saiposPasswordInput.value = login.saiposPassword
  }

  // Atualiza registro
  form.addEventListener("submit", async function(event) {
    event.preventDefault()
    const email = saiposEmailInput.value.trim()
    const password = saiposPasswordInput.value
    const login = { saiposEmail: email, saiposPassword: password }
    const updatedJsonData = JSON.stringify(login, null, 2)
    fs.writeFileSync(filePath, updatedJsonData)
  })
}

// Limpar seleção
document.addEventListener('DOMContentLoaded', function() {
  var cleanSelectionCheckbox = document.getElementById('clean-selection')
  var checkboxes = document.querySelectorAll('input[type="checkbox"]')
  
  cleanSelectionCheckbox.addEventListener('click', function() {
    if (this.checked) {
      checkboxes.forEach(function(checkbox) {
        checkbox.checked = false
      })
    }
  })
})

// Automação de checkboxes
function synchronizeCheckboxes(mainCheckboxId, targetCheckboxId) {
  var mainCheckbox = document.getElementById(mainCheckboxId);
  var targetCheckbox = document.getElementById(targetCheckboxId)
  
  mainCheckbox.addEventListener('change', function() {
    if (this.checked) {
      targetCheckbox.checked = true;
    } else {
      targetCheckbox.checked = false;
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  var choicesCsvInput = document.getElementById('choices-csv')
  var proportionalPizzaCheckbox = document.getElementById('pizza-proportional')

  choicesCsvInput.addEventListener('change', function() {
    if (this.files.length > 0) {
      proportionalPizzaCheckbox.checked = true
    } else {
      proportionalPizzaCheckbox.checked = false
    }
  })
})

document.addEventListener('DOMContentLoaded', function() {
  var storeState = document.getElementById('store-state')
  var cestCheckbox = document.getElementById('drinks-cest')

  storeState.addEventListener('change', function() {
    if (this.value == "Minas Gerais") {
      cestCheckbox.checked = true
    } else {
      cestCheckbox.checked = false
    }
  })
})

document.addEventListener('DOMContentLoaded', function() {
  synchronizeCheckboxes('delivery-site', 'counter-pick-up')
  synchronizeCheckboxes('premium-menu', 'counter-instruction')
  synchronizeCheckboxes('card-flags', 'pix')
  synchronizeCheckboxes('easy-delivery', 'sale-status')
})

// Função para desmarcar checkboxes concorrentes
function checkboxDependency(checkboxId1, checkboxId2) {
  const checkbox1 = document.getElementById(checkboxId1);
  const checkbox2 = document.getElementById(checkboxId2);
  checkbox1.addEventListener('change', function() {
    if (this.checked) {
      checkbox2.checked = false; // Desmarca o checkbox2 se o checkbox1 for marcado
    }
  })
  checkbox2.addEventListener('change', function() {
    if (this.checked) {
      checkbox1.checked = false; // Desmarca o checkbox1 se o checkbox2 for marcado
    }
  })
}

checkboxDependency('counter-instruction', 'waiter-instruction')
checkboxDependency('premium-menu', 'basic-menu')
checkboxDependency('pizza-bigger', 'pizza-proportional')

// Ouve o evento de carregamento do DOM e inicia o processo de login
document.addEventListener("DOMContentLoaded", function() {

  // Inicia o processo de login quando o DOM é carregado
  startLogin() 
  
  // Adiciona um ouvinte para o evento de submissão do formulário
  document.getElementById("form").addEventListener("submit", async function(event) {

    // Previne o comportamento padrão de envio do formulário
    event.preventDefault() 
    try {

      // Recebe e armazena valores do formulário
      const formData = {
        saiposEmail: document.getElementById("saipos-email").value.replace(/\s/g, ''),
        saiposPassword: document.getElementById("saipos-password").value,
        storeId: document.getElementById("store-id").value,
        storeName: document.getElementById("store-name").value.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLowerCase().replace(/ç/g, 'c').replace(/[^a-z0-9]/g, ''),
        storeState: document.getElementById("store-state").value,
        storeCity: document.getElementById("store-city").value,
        tables: document.getElementById("tables").value,
        orderCards: document.getElementById("order-cards").value,
        shiftTime: document.getElementById("shift-time").value.replace(/[^\d,]/g, '').split(',').map(item => item.trim()),
        serviceFee: document.getElementById("service-fee").value.split(',').map(item => item.trim()),
        shiftDesc: document.getElementById("shift-desc").value.split(',').map(item => item.trim()),   
        waiters: document.getElementById("waiters").value,
        waitersDailyRate: document.getElementById("waiters-daily-rate").value.split(',').map(item => item.trim()),
        deliveryMen: document.getElementById("delivery-men").value,
        deliveryMenDailyRate: document.getElementById("delivery-men-daily-rate").value.split(',').map(item => item.trim()),
        pix: document.getElementById("pix").checked,
        cardFlags: document.getElementById("card-flags").checked,
        cancelPassword: document.getElementById("cancel-password").checked,
        cancelReason: document.getElementById("cancel-reason").checked,
        counterPickUp: document.getElementById("counter-pick-up").checked,
        saleStatus: document.getElementById("sale-status").checked,
        easyDelivery: document.getElementById("easy-delivery").checked,
        drinksCEST: document.getElementById("drinks-cest").checked,
        col42: document.getElementById("column-42").checked,
        admPermissions: document.getElementById("adm-permissions").checked,   
        minimumValue: document.getElementById("minimum-value").value,
        waiterInstruction: document.getElementById("waiter-instruction").checked,
        counterInstruction: document.getElementById("counter-instruction").checked,
        premiumMenu: document.getElementById("premium-menu").checked,
        basicMenu: document.getElementById("basic-menu").checked,
        deliverySite: document.getElementById("delivery-site").checked,
        startTime: document.getElementById("start-time").value.replace(/[^\d,]/g, ''),
        endTime: document.getElementById("end-time").value.replace(/[^\d,]/g, ''),
        weekDays: ProcessWeekDays(document.getElementById("start-day").value, document.getElementById("end-day").value),
        pizzaBigger: document.getElementById("pizza-bigger").checked,
        pizzaProportional: document.getElementById("pizza-proportional").checked,
      } 
    
      // Obtém arquivos CSV
      const districtsCSVFile = document.getElementById("districts-csv").files[0]
      const menuCSVFile = document.getElementById("menu-csv").files[0]
      const choicesCSVFile = document.getElementById("choices-csv").files[0]

      // Chama a função que transforma arquivos CSV em arrays, se existirem os arquivos
      if (choicesCSVFile) {
        formData.choicesData = await processCSV(choicesCSVFile.path, ['Bairro', 'Taxa', 'Entregador'], choicesMappings)
      }
      if (menuCSVFile) {
        formData.menuData = await processCSV(menuCSVFile.path, ['Categoria', 'Produto', 'Preço', 'Descrição', 'Adicional', 'Código'], menuMappings)
      }
      if (districtsCSVFile) {
        formData.districtsData = await processCSV(districtsCSVFile.path, ['Adicional', 'Item', 'Preço', 'Descrição', 'Quantidade', 'Código'], districtsMappings)
      }

      // Ajuste dos tamanhos de arrays
      adjustArraySize(formData.waitersDailyRate, formData.waiters)
      adjustArraySize(formData.deliveryMenDailyRate, formData.deliveryMen)
      adjustArraySize(formData.serviceFee, formData.shiftDesc)
      
      // Imprime os dados do formulário para fins de testes
      console.log(formData, `${formData.storeId} | ${formData.saiposEmail.slice(0, -11)}`)

      // Conferências de envio
      if (formData.waiters && !formData.storeName) {
        ipcRenderer.send('show-alert', 'Para cadastrar garçons, preencha o nome da loja')
        return
      } 
      if ((formData.waitersDailyRate[0] === "" && formData.waiters > 0) || ((formData.waitersDailyRate.length != formData.waiters) && (formData.waiters != 0)) || (formData.waitersDailyRate[0] !== "" && !formData.waiters > 0))  {
        ipcRenderer.send('show-alert', 'Para cadastrar garçons, preencha todos campos da categoria em mesma quantidade, ou diária única')
        return
      } 
      if ((formData.deliveryMenDailyRate[0] === "" && formData.deliveryMen > 0) || ((formData.deliveryMenDailyRate.length != formData.deliveryMen) && (formData.deliveryMen != 0)) || (formData.deliveryMenDailyRate[0] !== "" && !formData.deliveryMen > 0))  {       
        ipcRenderer.send('show-alert', 'Para cadastrar entregadores, preencha todos campos da categoria em mesma quantidade, ou diária única')
        return
      } 
      else if (formData.easyDelivery && !(formData.saleStatus && formData.deliveryMen)) {
        ipcRenderer.send('show-alert', 'Para cadastrar Entrega Fácil, cadastre entregadores (Precisa Ifood) ou status de entrega')
        return
      } 
      if ((formData.serviceFee[0] === "" && formData.shiftDesc > 0) || ((formData.serviceFee.length != formData.shiftDesc.length) && (formData.shiftDesc[0] != "")) || (formData.serviceFee[0] !== "" && !formData.shiftDesc > 0) || (formData.shiftDesc.length != formData.shiftTime.length))  {       
        ipcRenderer.send('show-alert', 'Para cadastrar turnos, preencha todos campos da categoria em mesma quantidade, ou taxa única')
        return
      } 
      else if ((districtsCSVFile) && !(formData.storeCity || formData.storeState)) {
        ipcRenderer.send('show-alert', 'Para cadastrar bairros, preencha os campos de localização')
        return
      } 
      else if (formData.deliverySite && !(formData.minimumValue && formData.storeName)) {
        ipcRenderer.send('show-alert', 'Para cadastrar site, preencha ambos campos valor mínimo, nome da loja')
        return
      }
      else if ((formData.weekDays.includes(true) || formData.startTime.length > 0 || formData.endTime.length > 0) && (!formData.weekDays.includes(true) || !formData.startTime.length > 0 || !formData.endTime.length > 0)) {
        ipcRenderer.send('show-alert', 'Para cadastrar horários, preencha os 4 campos referentes apropriadamente')
        return
      }
      else if ((formData.weekDays.includes(true) && !(formData.deliverySite || formData.basicMenu || formData.premiumMenu))) {
        ipcRenderer.send('show-alert', 'Para cadastrar horários, selecione ao menos o site delivery ou cardápio digital')
        return
      }
      else if ((formData.basicMenu || formData.premiumMenu) && !formData.storeName) {
        ipcRenderer.send('show-alert', 'Para cadastrar cardápio digital, preencha O nome da loja')
        return
      }
      else if ((formData.counterPickUp) && !formData.deliverySite) {
        ipcRenderer.send('show-alert', 'Para cadastrar retirada no balcão, marque site delivery')
        return
      }
      else if ((formData.menuCSVFile) && !(formData.pizzaBigger || formData.pizzaProportional)) {
        ipcRenderer.send('show-alert', 'Para cadastrar pizzas, marque a forma de rateio')
        return
      }
      else {
        formSubmitted(formData) // Chama função que trata a finalização do formulário
      }
    } catch (error) {
      // Registra erros no console
      console.error('Ocorreu um erro ao enviar o FORMULÁRIO:', error) 
    }
  })
})

