const fs = require('fs')
const csv = require('csv-parser')

function processCSV(filePath, headers) {
    let mappings = []
    headers[0] == "Categoria" ? mappings = menuMappings :
    headers[0] == "Adicional" ? mappings = choicesMappings :
    headers[0] == "Área" ? mappings = deliveryAreasMappings : null

    return new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(filePath)
            .pipe(csv({ headers: headers }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const processedData = processData(results, mappings)
                if (mappings === menuMappings) {
                    processedData.splice(1, 0, {
                        category: 'Avisos',
                        product: 'Para pagamento via pix, utilizar chave:',
                        price: '0',
                        description: 'Enviar comprovante de pagamento para o contato:',
                        choiceMenu: [''],
                        code: ''
                    })
                }
                processedData.shift()
                resolve(processedData)
            })
            .on('error', (error) => reject(error))
    })
}

function processData(data, mappings) {
    return data.map(item => {
        const rowObject = {}
        mappings.forEach(mapping => {
            let value = item[mapping.field] || ''
            if (value === undefined || value === null || value.trim() === '') {
                value = (mapping.key === 'choiceMenu' || mapping.key === 'quantity') ? [''] : ''
            } else {
                if (['price', 'deliveryMenFee', 'fee'].includes(mapping.key)) {
                    value = value.replace(/,/g, '.').replace(/[^\d.]/g, '')
                }
                if ((mapping.key === 'choiceMenu' || mapping.key === 'quantity') && value) {
                    value = value.split(',').map(part => part.trim())
                }
            }
            rowObject[mapping.key] = value
        })
        return rowObject
    })
}

const choicesMappings = [
    { key: 'choice', field: 'Adicional' },
    { key: 'item', field: 'Item' },
    { key: 'price', field: 'Preço' },
    { key: 'description', field: 'Descrição' },
    { key: 'quantity', field: 'Quantidade' },
    { key: 'code', field: 'Código' }
]
const menuMappings = [
    { key: 'category', field: 'Categoria' },
    { key: 'product', field: 'Produto' },
    { key: 'price', field: 'Preço' },
    { key: 'description', field: 'Descrição' },
    { key: 'choiceMenu', field: 'Adicional' },
    { key: 'code', field: 'Código' }
]
const deliveryAreasMappings = [
    { key: 'deliveryArea', field: 'Área' },
    { key: 'deliveryFee', field: 'Taxa' },
    { key: 'deliveryMenFee', field: 'Entregador' }
]

module.exports = { processCSV }
