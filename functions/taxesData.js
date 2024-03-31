module.exports = async function taxesData(saiposAuthToken, storeId, chsd) {
  try {
    
    async function getTaxesDataId() {
      const url = `https://api.saipos.com/v1/stores/${storeId}/taxes_datas/`
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
        const taxData = responseData.find(tax => tax.desc_store_taxes_data === "Bebidas")
        console.log(taxData.id_store_taxes_data)
        return taxData ? taxData.id_store_taxes_data : null
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function getTaxesDataCfopId(taxesDataId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/taxes_datas?filter=%7B%22where%22:%7B%22id_store_taxes_data%22:${taxesDataId}%7D,%22include%22:%7B%22relation%22:%22taxes_data_cfop%22,%22scope%22:%7B%22include%22:%22cfop%22%7D%7D%7D`
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
        const taxCfop = responseData.find(cfop => cfop.desc_store_taxes_data === "Bebidas")
        console.log(taxCfop.taxes_data_cfop[0].id_store_taxes_data_cfop)
        return taxCfop ? taxCfop.taxes_data_cfop[0].id_store_taxes_data_cfop : null
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function updateCest(taxesDataId, taxesDataCfopId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/taxes_datas/${taxesDataId}`
      const data = {
        "id_store_taxes_data": taxesDataId,
        "id_store": storeId,
        "id_cest": 159,
        "taxes_data_cfop": [
          {
            "id_store_taxes_data_cfop": taxesDataCfopId
          }
        ]
      }
      const options = {
        method: 'PUT',
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

    async function updateContigency() {
      const url = `https://api.saipos.com/v1/stores/${storeId}/taxes_profile`
      const data = {
        "id_store": storeId,
        "contingency": "N"
      }
      const options = {
        method: 'PUT',
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

    const taxesDataId = await getTaxesDataId()
    const taxesDataCfopId = await getTaxesDataCfopId(taxesDataId)

    chsd.cest ? await updateCest(taxesDataId, taxesDataCfopId) : null
    chsd.contigency ? await updateContigency() : null

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de DADOS FISCAIS ', error)
    return  ["DADOS FISCAIS: ",{ stack: error.stack }]
  }
}
