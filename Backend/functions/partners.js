module.exports = async function partners(saiposAuthToken, storeId, chsd) {
  try {
    
    async function getPartnerId(dataType) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/${dataType}`
      const options = {
        method: 'GET',
        headers: {
          'Authorization': saiposAuthToken,
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`)
        }
        const responseData = await response.json()
        if (responseData.length > 0) {
          if (dataType === "site_data") {
            console.log('Response:', responseData[0].id_store_site_data)
            return responseData[0].id_store_site_data
          } else {
            console.log('Response:', responseData[0].id_store_table_data)
            return responseData[0].id_store_table_data
          }
        } else {
          return ""
        }
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function getPaymentId(desiredPayment) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/payment_types/`
      const options = {
        method: 'GET',
        headers: {
          'Authorization': saiposAuthToken,
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`)
        }
        const responseData = await response.json()
        const paymentId = responseData.find(payment => payment.desc_store_payment_type === desiredPayment)
        return paymentId ? paymentId.id_store_payment_type : null
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function postEnablePartner(partnerId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/partners_sale/enable_partner_sale`
      const data = {
        "id_store_partner_sale": 0,
        "enabled": "Y",
        "id_store": storeId,
        "id_partner_sale": partnerId
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    async function pustSite(method, siteId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/site_data/${siteId}`
      const data = {
          "pickup_counter": chsd.pickupCounter,
          "url_site": `${chsd.storeName}.saipos.com`,
          "primary_color": "#000000",
          "address_config": 2,
          "minimum_value": chsd.minimumValue,
          "id_store": storeId,
          "id_photo_site_cover": 25,
          "id_photo_site_background": 71,
          "config_type": "sitedelivery"
      }
      const options = {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    async function pustMenu(method, menuId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/table_data/${menuId}`
      const data = {
          "url_site": `${chsd.storeName}.saipos.com`,
          "primary_color": "#000000",
          "id_store": storeId,
          "id_photo_site_cover": 25,
          "online_order_enabled": chsd.premiumMenu,
      }
      const options = {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }
    
    async function postSchedule(weekDay, target) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/${target}/insert-all`
      const data = {
        "upsert": [
          {
            "day_week": weekDay,
            "start_time": chsd.startTime,
            "end_time": chsd.endTime,
            "new": true,
          }
        ]
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    async function postPayment(saiposPaymentId, storePaymentId, target) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/${target}/upsert-payment-types`
      const data = {
        "upsert": [
          {
            "id_store_payment_type": storePaymentId,
            "id_payment_type": saiposPaymentId,
            "new": true
          }
        ]
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': saiposAuthToken, 
          'Content-Type': 'application/json'
        }
      }
      try {
        const response = await fetch(url, options)
        const responseData = await response.json()
        console.log('Response:', responseData)
        return responseData
      } catch (error) {
        console.error('Error:', error)
        return null
      } 
    }

    const desiredPayments = [
      "Pix",
      "Dinheiro",
      "Crédito",
      "Débito",
      "Crédito Elo",
      "Crédito Mastercard",
      "Crédito Visa",
      "Crédito American Express",
      "Crédito Hipercard",
      "Débito Elo",
      "Débito Mastercard",
      "Débito Visa"
    ]
    
    const paymentMappings = {
      Pix: 'pix',
      Dinheiro: 'money',
      'Crédito': 'cre',
      'Débito': 'deb',
      'Crédito Elo': 'creElo',
      'Crédito Mastercard': 'creMaster',
      'Crédito Visa': 'creVis',
      'Crédito American Express': 'creAmex',
      'Crédito Hipercard': 'creHiper',
      'Débito Elo': 'debElo',
      'Débito Mastercard': 'debMaster',
      'Débito Visa': 'debVisa'
    }
    
    const saiposPaymentId = {
      pix: 54,
      money: 9,
      cre: 52,
      deb: 53,
      creElo: 21,
      creMaster: 21,
      creVis: 18,
      creAmex: 15,
      creHiper: 20,
      debElo: 22,
      debMaster: 3,
      debVisa: 5
    }
    
    const storePaymentId = {}
    
    for (const paymentType of desiredPayments) {
      storePaymentId[paymentType] = await getPaymentId(paymentType)
    }

    if (chsd.deliverySite) {
      await postEnablePartner(7)
      const siteId = await getPartnerId("site_data")
      siteId === "" ? await pustSite('POST', siteId) : await pustSite('PUT', siteId)
      for (const [day, value] of Object.entries(chsd.weekDays)) {
        if (value) {
          const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day) + 1
          await postSchedule(dayIndex, "schedules_service")
        }
      }
      for (const paymentType of desiredPayments) {
        const saiposPaymentKey = paymentMappings[paymentType]
        const paymentId = saiposPaymentKey ? saiposPaymentId[saiposPaymentKey] : null
        const storePaymentType = storePaymentId[paymentType]
        if (storePaymentType) {
          await postPayment(paymentId , storePaymentType, "site-delivery")
        }
      }
    }
    
    if (chsd.basicMenu || chsd.premiumMenu) {
      await postEnablePartner(32)
      const menuId = await getPartnerId("table_data")
      menuId === "" ? await pustMenu('POST', menuId) : await pustMenu('PUT', menuId)
      for (const [day, value] of Object.entries(chsd.weekDays)) {
        if (value) {
          const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day) + 1
          await postSchedule(dayIndex, "table_data_schedules_service")
        }
      }
      for (const paymentType of desiredPayments) {
        const saiposPaymentKey = paymentMappings[paymentType]
        const saiposPaymentId = saiposPaymentKey ? saiposPaymentId[saiposPaymentKey] : null
        const storePaymentType = storePaymentId[paymentType]
        if (storePaymentType) {
          await postPayment(saiposPaymentId, storePaymentType, "digital-table")
        }
      }  
    }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CANAIS DE VENDA', error)
    return  ["CANAIS DE VENDA: ",{ stack: error.stack }]
  }
}
