module.exports = async function shifts(saiposAuthToken, storeId, chsd) {
  try {
    console.log('asd')
    async function getShiftId() {
      const url = `https://api.saipos.com/v1/stores/${storeId}/shifts/`
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
        console.log(responseData[0].id_store_shift)
        return responseData ? responseData[0].id_store_shift : null
      } catch (error) {
        console.error('Error:', error)
        return null
      }
    }

    async function pustShift(method, shiftDesc, shiftTime, shiftCharge, shiftId) {
      const url = `https://api.saipos.com/v1/stores/${storeId}/shifts/${shiftId}`
      const data = {
        "id_store_shift": shiftId > 0 ? shiftId : 0,
        "desc_store_shift": shiftDesc,
        "starting_time": shiftTime,
        "id_store": storeId,
        "service_charge": shiftCharge,
        "use_service_charge": shiftCharge > 0 ? "Y" : "N"
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

    const shiftId = await getShiftId()
    
    await pustShift("PUT", chsd.shiftDesc[0], chsd.shiftTime[0], chsd.shiftCharge[0], shiftId)

    for (let i = 1; i < chsd.shiftDesc.length; i++) {
      await pustShift("POST", chsd.shiftDesc[i], chsd.shiftTime[i], chsd.shiftCharge[i], "")
    }

  // Tratamento de erros
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de TURNOS', error)
    return  ["TURNOS: ",{ stack: error.stack }]
  }
}
