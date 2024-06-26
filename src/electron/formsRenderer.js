// Importações do preload.js
const api = window.api
const toggleWindowSize = isVisible => api.toggleWindowSize(isVisible)
const openExternal = url => api.openExternal(url)
const showAlert = msg => api.showAlert(msg)
const processCSV = (...args) => api.processCSV(...args)
const executeConfigure = (...args) => api.executeConfigure(...args)
const sendSaiposAuthToken = token => api.sendSaiposAuthToken(token)
const normalizeText = text => api.normalizeText(text)

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

  // Abrir link externamente
  document.getElementById('doc-button').addEventListener('click', (event) => {
    event.preventDefault()
    const url = event.currentTarget.href
    openExternal(url)
  })

  // Colapsar conteúdo
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
        document.getElementById('store-data-state').value = responseData.state
        document.getElementById('store-data-city').value = responseData.city
        document.getElementById('store-data-district').value = responseData.neighborhood
        document.getElementById('store-data-address').value = responseData.street
      } catch (error) {
        console.error('Erro na requisição CEP:', error)
      }
    }
  })

  // Função para comunicação com usuário
  function logAndSendAlert(msg) {
    console.log(msg)
    showAlert(msg)
  }

  // Função para tratar dias da semana
  function processWeekDays(startDay, endDay) {
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
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
  function handleWorkers(quantity, dailyRate, worker, extra) {
    let result = []
  
    if (typeof quantity === 'string' && quantity.includes(",")) {
      quantity = quantity.split(",")
    } else  {
      let quantityNum = parseInt(quantity)
      if (quantityNum == NaN) {
        quantity = [quantity]
      } else {
        quantity = quantityNum
      }
    }
    
    if (typeof dailyRate === 'string' && dailyRate.includes(",")) {
      dailyRate = dailyRate.split(",").map(item => parseInt(item, 10))
    } else if (typeof dailyRate === 'string') {
      dailyRate = parseInt(dailyRate, 10)
    }
  
    let iterations = Array.isArray(quantity) ? quantity.length : quantity
  
    for (let i = 0; i < iterations; i++) {
      let desc = Array.isArray(quantity) ? quantity[i] : `${worker} ${i + 1}`
      let rate = Array.isArray(dailyRate) ? dailyRate[i] : dailyRate
  
      if (Array.isArray(dailyRate) && i >= dailyRate.length) {
        rate = 0
      } else if (isNaN(rate)) {
        rate = 0 
      }
  
      result.push({ desc, dailyRate: rate })
    }
  
    if (worker === "Garçom" && extra) {
      result.push({ desc: "Caixa", dailyRate: 0 })
    }
    if (worker === "Entregador" && extra) {
      result.push({ desc: "Entrega fácil", dailyRate: 0 })
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
  async function formSubmitted(formData) {
    ['menu-remove', 'delivery-area-remove', 'choices-remove'].forEach(id => {
      document.getElementById(id).style.display = 'none'
    })   

    cleanSelection()
    logAndSendAlert(`INÍCIO: ${formData.generalData.storeId}`)
    logAndSendAlert(await executeConfigure(formData))
  }

  // Função para limpar seleção
  function cleanSelection() {
    ['menu-remove', 'delivery-area-remove', 'choices-remove'].forEach(id => {
      document.getElementById(id).style.display = 'none'
    })

    document.querySelectorAll('input, select').forEach(element => {
      if (element != document.getElementById("saipos-auth-token")) {
        if (element.type === 'checkbox') {
          element.checked = false
        } else if (element.tagName === 'SELECT' || element.type === 'text' || element.type === 'number' || element.type === 'file') {
          element.value = ""
        }
      }
    })
  }

  // Função para verificar itens de um objeto
  const hasValidValue = {
    allTrue: function(object) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          if (!object[key]) {
            return false
          }
        }
      }
      return true
    },

    someTrue: function(object) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          if (object[key]) {
            return true
          }
        }
      }
      return false
    }
  }

  // Integração Hubspot
  const hubspotTicketId = document.getElementById('hubspot-id')
  hubspotTicketId.addEventListener('blur', async function() {

    try {
      let hubspotCompanyId, hubspotCompany, hubspotTicket
      const token = await api.requestToken()
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      // ID Empresa
      const responseCompanyId = await fetch(`https://api.hubapi.com/crm/v4/objects/tickets/${hubspotTicketId.value}/associations/company`, {
        method: 'GET',
        headers: headers
      })
      const responseCompanyIdData = await responseCompanyId.json()
      if (responseCompanyId.ok) {
        hubspotCompanyId = responseCompanyIdData.results[0].toObjectId
      }
  
      // Dados empresa
      const responseCompany = await fetch(`https://api.hubapi.com/crm/v3/objects/companies/search`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          "filterGroups": [{
            "filters": [{
              "propertyName": "hs_object_id",
              "operator": "EQ",
              "value": hubspotCompanyId
            }]
          }],
          "properties": [
            "estado", "city", "bairro", "address", "zip", "endereco_numero", "endereco_complemento",
            "cnpj", "inscricao_estadual", "cnae", "id_saipos"
          ],
          "limit": 1
        })
      })
      const responseCompanyData = await responseCompany.json()
      if (responseCompany.ok) {
        hubspotCompany = responseCompanyData.results[0].properties
      }
      
      // Dados ticket
      const responseTicket = await fetch(`https://api.hubapi.com/crm/v3/objects/tickets/search`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          "filterGroups": [{
            "filters": [{
              "propertyName": "hs_object_id",
              "operator": "EQ",
              "value": hubspotTicketId.value 
            }]
          }],
          "properties": [
            "subject", "id_saipos", "n1_2_areas_de_entrega_", "n2__metodo_de_calculo_para_pizzas_e_", 
            "nome_das_lojas_no_ifood", "n1_4_nome_dos_garcons_", "n1_5_valor_da_diaria_de_garcons_",
            "n1_3_nome_dos_entregadores_", "n1_4_diaria_dos_entregadores_", "site_com_dominio_saipos_",
            "aceita_retirada_no_balcao", "cardapio_com_dominio_saipos_", "instrucoes_de_pagamento",
            "valor_minimo_de_pedido_", "quantidade_de_mesas_no_salao_",
            "ids_do_ifood", "configuracoes__quicksaipos_", "pagamento__quicksaipos_", "usuarios__quicksaipos_",
            "status_de_venda__quicksaipos_", "descricao_turno__quicksaipos_", "horario_turno__quicksaipos_",
            "taxa_turno__quicksaipos_", "dias_fim__quicksaipos_", "horario_de_inicio__quicksaipos_",
            "horario_de_fim__quicksaipos_", "quantidade_de_comandas__quicksaipos_", 
            "dias_inicio__quicksaipos_", "cardapio___tipo_de_solicitacao"          
          ],
          "limit": 1
        })
      })
      const responseTicketData = await responseTicket.json()
      if (responseTicket.ok) {
        hubspotTicket = responseTicketData.results[0].properties
      }
      
      cleanSelection()
      responseTicket.id_saipos != responseCompany.id_saipos ? logAndSendAlert("Empresa posivelmente errada, confira!") : null

      // Inserção no formulário
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-pix').checked = hubspotTicket.pagamento__quicksaipos_.includes('Pix') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-master').checked = hubspotTicket.pagamento__quicksaipos_.includes('Mastercard') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-elo').checked = hubspotTicket.pagamento__quicksaipos_.includes('Elo') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-visa').checked = hubspotTicket.pagamento__quicksaipos_.includes('Visa') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-amex').checked = hubspotTicket.pagamento__quicksaipos_.includes('Amex') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-hiper').checked = hubspotTicket.pagamento__quicksaipos_.includes('Hiper') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-sodexo').checked = hubspotTicket.pagamento__quicksaipos_.includes('Sodexo') ? true : false : null;
      hubspotTicket.pagamento__quicksaipos_ ? document.getElementById('payment-types-alelo').checked = hubspotTicket.pagamento__quicksaipos_.includes('Alelo') ? true : false : null;

      hubspotTicket.configuracoes__quicksaipos_ ? document.getElementById('config-col42').checked = hubspotTicket.configuracoes__quicksaipos_.includes('Colunas de impressão: 42') ? true : false : null;
      hubspotTicket.configuracoes__quicksaipos_ ? document.getElementById('config-permissions').checked = hubspotTicket.configuracoes__quicksaipos_.includes('Permissões de ADM') ? true : false : null;
      hubspotTicket.configuracoes__quicksaipos_ ? document.getElementById('config-cancel-pass').checked = hubspotTicket.configuracoes__quicksaipos_.includes('Motivo para cancelamento') ? true : false : null;
      hubspotTicket.configuracoes__quicksaipos_ ? document.getElementById('config-cancel-reason').checked = hubspotTicket.configuracoes__quicksaipos_.includes('Senha para cancelamento') ? true : false : null;
      hubspotTicket.configuracoes__quicksaipos_ ? document.getElementById('config-kds').checked = hubspotTicket.configuracoes__quicksaipos_.includes('KDS') ? true : false : null;

      hubspotTicket.usuarios__quicksaipos_ ? document.getElementById('user-waiter-app').checked = hubspotTicket.usuarios__quicksaipos_.includes('App Garçom') ? true : false : null;
      hubspotTicket.usuarios__quicksaipos_ ? document.getElementById('user-cashier').checked = hubspotTicket.usuarios__quicksaipos_.includes('Caixa') ? true : false : null;

      hubspotTicket.status_de_venda__quicksaipos_ ? document.getElementById('sale-status-left').checked = hubspotTicket.status_de_venda__quicksaipos_ == 'Saiu para entrega' ? true : false : null;
      hubspotTicket.status_de_venda__quicksaipos_ ? document.getElementById('sale-status-easy-delivery').checked = hubspotTicket.status_de_venda__quicksaipos_ == 'Entrega fácil' ? true : false : null;

      hubspotTicket.n1_2_areas_de_entrega_ ? document.getElementById('delivery-area-district').checked = hubspotTicket.n1_2_areas_de_entrega_ == "Por Bairro" ? true : false : null;
      hubspotTicket.n1_2_areas_de_entrega_ ? document.getElementById('delivery-area-radius').checked = hubspotTicket.n1_2_areas_de_entrega_ == "Por Raio e Mapa" ? true : false : null;

      hubspotTicket.n2__metodo_de_calculo_para_pizzas_e_ ? document.getElementById('apportionment-proportional').checked = hubspotTicket.n2__metodo_de_calculo_para_pizzas_e_ == 'Rateio proporcional' ? true : false : null;
      hubspotTicket.n2__metodo_de_calculo_para_pizzas_e_ ? document.getElementById('apportionment-bigger').checked = hubspotTicket.n2__metodo_de_calculo_para_pizzas_e_ == 'Maior Valor' ? true : false : null;

      hubspotTicket.site_com_dominio_saipos_ ? document.getElementById('partners-site-delivery').checked = hubspotTicket.site_com_dominio_saipos_ == 'Sim' ? true : false : null;
      hubspotTicket.aceita_retirada_no_balcao ? document.getElementById('partners-counter-pickup').checked = hubspotTicket.aceita_retirada_no_balcao == 'Sim' ? true : false : null;
      hubspotTicket.cardapio___tipo_de_solicitacao ? document.getElementById('partners-basic-digital-menu').checked = hubspotTicket.cardapio___tipo_de_solicitacao == 'Cardapio basic' ? true : false : null;
      hubspotTicket.cardapio___tipo_de_solicitacao ? document.getElementById('partners-premium-digital-menu').checked = hubspotTicket.cardapio___tipo_de_solicitacao == 'Cardapio premium' ? true : false : null;
      hubspotTicket.instrucoes_de_pagamento ? document.getElementById('partners-instruction-counter').checked = hubspotTicket.instrucoes_de_pagamento == 'Passar no caixa e fazer o pagamento' ? true : false : null;
      hubspotTicket.instrucoes_de_pagamento ? document.getElementById('partners-instruction-waiter').checked = hubspotTicket.instrucoes_de_pagamento == 'Aguardar o garçom para fazer o pagamento' ? true : false : null;

      hubspotTicket.dias_inicio__quicksaipos_ ? document.getElementById('partners-start-day').value = hubspotTicket.dias_inicio__quicksaipos_ ? hubspotTicket.dias_inicio__quicksaipos_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.dias_fim__quicksaipos_ ? document.getElementById('partners-end-day').value = hubspotTicket.dias_fim__quicksaipos_ ? hubspotTicket.dias_fim__quicksaipos_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.horario_de_inicio__quicksaipos_ ? document.getElementById('partners-start-time').value = hubspotTicket.horario_de_inicio__quicksaipos_ ? hubspotTicket.horario_de_inicio__quicksaipos_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.horario_de_fim__quicksaipos_ ? document.getElementById('partners-end-time').value = hubspotTicket.horario_de_fim__quicksaipos_ ? hubspotTicket.horario_de_fim__quicksaipos_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.valor_minimo_de_pedido_ ? document.getElementById('partners-minimum-value').value = hubspotTicket.valor_minimo_de_pedido_ ? hubspotTicket.valor_minimo_de_pedido_.replace(/\n/g, ',') : '' : null;

      hubspotTicket.descricao_turno__quicksaipos_ ? document.getElementById('shift-desc').value = hubspotTicket.descricao_turno__quicksaipos_ ? hubspotTicket.descricao_turno__quicksaipos_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.horario_turno__quicksaipos_ ? document.getElementById('shift-time').value = hubspotTicket.horario_turno__quicksaipos_ ? hubspotTicket.horario_turno__quicksaipos_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.taxa_turno__quicksaipos_ ? document.getElementById('shift-service-fee').value = hubspotTicket.taxa_turno__quicksaipos_ ? hubspotTicket.taxa_turno__quicksaipos_.replace(/\n/g, ',') : '' : null;

      hubspotTicket.n1_4_nome_dos_garcons_ ? document.getElementById('waiters-quantity').value = hubspotTicket.n1_4_nome_dos_garcons_ ? hubspotTicket.n1_4_nome_dos_garcons_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.n1_5_valor_da_diaria_de_garcons_ ? document.getElementById('waiters-daily-rate').value = hubspotTicket.n1_5_valor_da_diaria_de_garcons_ ? hubspotTicket.n1_5_valor_da_diaria_de_garcons_.replace(/\n/g, ',') : '' : null;

      hubspotTicket.n1_3_nome_dos_entregadores_ ? document.getElementById('delivery-men-quantity').value = hubspotTicket.n1_3_nome_dos_entregadores_ ? hubspotTicket.n1_3_nome_dos_entregadores_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.n1_4_diaria_dos_entregadores_ ? document.getElementById('delivery-men-daily-rate').value = hubspotTicket.n1_4_diaria_dos_entregadores_ ? hubspotTicket.n1_4_diaria_dos_entregadores_.replace(/\n/g, ',') : '' : null;

      hubspotTicket.ids_do_ifood ? document.getElementById('partners-ifood-code').value = hubspotTicket.ids_do_ifood ? hubspotTicket.ids_do_ifood.replace(/\n/g, ',') : '' : null;
      hubspotTicket.nome_das_lojas_no_ifood ? document.getElementById('partners-ifood-name').value = hubspotTicket.nome_das_lojas_no_ifood ? hubspotTicket.nome_das_lojas_no_ifood.replace(/\n/g, ',') : '' : null;

      hubspotTicket.quantidade_de_mesas_no_salao_ ? document.getElementById('table-orders').value = hubspotTicket.quantidade_de_mesas_no_salao_ ? hubspotTicket.quantidade_de_mesas_no_salao_.replace(/\n/g, ',') : '' : null;
      hubspotTicket.quantidade_de_comandas__quicksaipos_ ? document.getElementById('order-cards').value = hubspotTicket.quantidade_de_comandas__quicksaipos_ ? hubspotTicket.quantidade_de_comandas__quicksaipos_.replace(/\n/g, ',') : '' : null;
      
      hubspotTicket.subject ? document.getElementById('domain').value = await normalizeText(hubspotTicket.subject.slice(8)) : null
      hubspotTicket.id_saipos ? document.getElementById('store-id').value = hubspotTicket.id_saipos ? hubspotTicket.id_saipos.replace(/\n/g, ',') : '' : null
      hubspotCompany.estado ? document.getElementById('store-data-state').value = hubspotCompany.estado : null
      hubspotCompany.city ? document.getElementById('store-data-city').value = hubspotCompany.city : null
      hubspotCompany.bairro ? document.getElementById('store-data-district').value = hubspotCompany.bairro : null
      hubspotCompany.address ? document.getElementById('store-data-address').value = hubspotCompany.address : null
      hubspotCompany.endereco_numero ? document.getElementById('store-data-number').value = hubspotCompany.endereco_numero : null
      hubspotCompany.zip ? document.getElementById('store-data-zip').value = hubspotCompany.zip : null
      hubspotCompany.endereco_complemento ? document.getElementById('store-data-complement').value = hubspotCompany.endereco_complemento : null
      hubspotCompany.cnpj ? document.getElementById('store-data-cnpj').value = hubspotCompany.cnpj : null
      hubspotCompany.inscricao_estadual ? document.getElementById('store-data-state-registration').value = hubspotCompany.inscricao_estadual : null
      hubspotCompany.cnae ? document.getElementById('store-data-cnae').value = hubspotCompany.cnae : null
    
    
    
    } catch (error) {
      console.error("Erro na requisição Hubspot: ", error)
    }
  })

  // Função para checar token de autorização
  async function apiTest(saiposAuthToken, id) {
    try {
      const response = await fetch(`https://api.saipos.com/v1/stores/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': saiposAuthToken
        }
      })
      if (response.ok) {
        return true
      } else {
        return false
      }
    } catch {
      return false
    }
  }

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
          control.checked = 
          document.querySelectorAll(targets).length ===
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

  // Carrega Token Saipos
  const tokenInputField = document.getElementById('saipos-auth-token')
  const storedToken = localStorage.getItem('saiposAuthToken')
  if (storedToken) {
    tokenInputField.value = storedToken
  }

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
        waitersDailyRate: document.getElementById('waiters-daily-rate').value,
        deliveryMenQuantity: document.getElementById('delivery-men-quantity').value,
        deliveryMenDailyRate: document.getElementById('delivery-men-daily-rate').value,
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
      
      // Exporta Token Saipos
      const saiposAuthToken = document.getElementById('saipos-auth-token').value.trim()
      const tokenValue = tokenInputField.value
      sendSaiposAuthToken(saiposAuthToken)

      // Trata CSV
      elementValues.choicesCsv ? elementValues.choicesCsv = await processCSV(elementValues.choicesCsv.path, ['Adicional', 'Item', 'Preço', 'Descrição', 'Quantidade', 'Código']) : null
      elementValues.menuCsv ? elementValues.menuCsv = await processCSV(elementValues.menuCsv.path, ['Categoria', 'Produto', 'Preço', 'Descrição', 'Adicional', 'Código']) : null
      elementValues.deliveryAreaCsv ? elementValues.deliveryAreaCsv = await processCSV(elementValues.deliveryAreaCsv.path, ['Área', 'Taxa', 'Entregador']) : null

      // Trata dias da semana
      elementValues.weekDays = await processWeekDays(elementValues.partnersStartDay, elementValues.partnersEndDay)

      // Trata tipo de entrega
      elementValues.deliveryAreaRadius === true ? elementValues.deliveryOption = "A" : 
      elementValues.deliveryAreaDistrict === true ? elementValues.deliveryOption = "D" : ""

      // Trata arrays
      elementValues.deliveryMen = await handleWorkers(elementValues.deliveryMenQuantity, elementValues.deliveryMenDailyRate, "Entregador", elementValues.saleStatusEasyDelivery)
      elementValues.users = await handleWorkers(elementValues.waitersQuantity, elementValues.waitersDailyRate, "Garçom", elementValues.userCashier)
      elementValues.ifood = await processIfoodData(elementValues.partnersIfoodCode, elementValues.partnersIfoodName)
      elementValues.shifts = await processShiftData(elementValues.shiftDesc, elementValues.shiftTime, elementValues.shiftServiceFee)

      // Trata canais de venda
      const hasPartners = elementValues.partnersSiteDelivery || elementValues.partnersBasicDigitalMenu || elementValues.partnersPremiumDigitalMenu

      // Declaração do objeto de tarefa
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
          deliveryOption: elementValues.storeDataCnae ? (elementValues.deliveryOption ? elementValues.deliveryOption : "D") : "", 
          state: elementValues.storeDataCnae ? elementValues.storeDataState : "",
          city: elementValues.storeDataCnae ? elementValues.storeDataCity : "",
          cnae: elementValues.storeDataCnae.replace(/\D+/g, ''),
          district: elementValues.storeDataDistrict,
          zipCode: elementValues.storeDataZip,
          address: elementValues.storeDataAddress,
          addressNumber: elementValues.storeDataNumber,
          addressComplement: elementValues.storeDataComplement,
          stateReg: elementValues.storeDataStateRegistration,
          cnpj: elementValues.storeDataCnpj,
        },
        partnersChosen: {
          deliverySite: elementValues.partnersSiteDelivery, 
          basicMenu: elementValues.partnersBasicDigitalMenu,
          premiumMenu: elementValues.partnersPremiumDigitalMenu,
          pickupCounter: hasPartners ? elementValues.partnersCounterPickup : "",
          domain: hasPartners ? elementValues.domain : "",
          minimumValue: hasPartners ? elementValues.partnersMinimumValue : "",
          startTime: hasPartners ? elementValues.partnersStartTime : "",
          endTime: hasPartners ? elementValues.partnersEndTime : "",
          weekDays: hasPartners ? elementValues.weekDays : "",
          waiterInstruction: hasPartners ? elementValues.partnersInstructionWaiter : "",
          counterInstruction: hasPartners ? elementValues.partnersInstructionCounter : "",
        },
        usersChosen: {
          users: elementValues.userCashier || elementValues.userWaiterApp ? elementValues.users : "",
          domain: elementValues.userCashier || elementValues.userWaiterApp ? (elementValues.users ? elementValues.domain : "") : ""
        },
        ifoodIntegrationChosen: elementValues.ifood,
        shiftsChosen: elementValues.shifts,
        deliveryMenChosen: elementValues.deliveryMen,
        waitersChosen: elementValues.users,
        deliveryAreasChosen: {
          data: elementValues.deliveryAreaCsv,
          state: elementValues.deliveryAreaCsv ? elementValues.storeDataState: "",
          city: elementValues.deliveryAreaCsv ? elementValues.storeDataCity: "",
          deliveryOption: elementValues.deliveryAreaCsv ? elementValues.deliveryOption: ""
        },
        choicesChosen: {
          data: elementValues.choicesCsv,
          apportionmentBigger: elementValues.choicesCsv ? elementValues.apportionmentBigger : "",
          apportionmentProportional: elementValues.choicesCsv ? elementValues.apportionmentProportional : ""
        },
        menuChosen: elementValues.menuCsv,
        generalData: {
          storeId: elementValues.storeId,
          time: {},
          errorLog: []
        }, 
      }

      // Teste De Token
      const authTokenTest = await apiTest(saiposAuthToken, 18)
      const storeIdTest = await apiTest(saiposAuthToken, formData.generalData.storeId)

      // Console
      console.log(formData)
      
      // Verificações
      !authTokenTest ? logAndSendAlert("Insira 'Token' válido") :
      !storeIdTest ? logAndSendAlert("Insira 'ID da loja' válido") :
      (elementValues.userCashier || elementValues.userWaiterApp) && !formData.usersChosen.domain ? logAndSendAlert("Insira 'domínio'") :
      formData.deliveryAreasChosen.data && (!formData.deliveryAreasChosen.state || !formData.deliveryAreasChosen.city) ? logAndSendAlert("Insira 'estado' e 'cidade'") :
      !hasValidValue.allTrue(formData.storeDataChosen) && hasValidValue.someTrue(formData.storeDataChosen) ? logAndSendAlert("Insira 'dados da loja'") :
      hasPartners && !formData.partnersChosen.domain ? logAndSendAlert("Insira 'domínio'") :
      formSubmitted(formData)
      
      localStorage.setItem('saiposAuthToken', tokenValue)

    } catch (error) {
      console.error('Ocorreu um erro ao enviar o FORMULÁRIO:', error) 
    }
  })
})