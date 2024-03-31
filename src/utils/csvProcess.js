const fs = require('fs')
const csv = require('csv-parser')

// Transforma CSV em listas e chama a função de processo de dados
function processCSV(filePath, headers, mappings) {
    return new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(filePath)
            .pipe(csv({ headers: headers }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(processData(results, mappings))
            })
            .on('error', (error) => reject(error))
    })
}

// Processa os valores em dinheiro
function processPrice(price) {
    let priceNumber = price.replace(/[^\d.,]/g, '')
    let containsComma = priceNumber.includes(',')
    if (!priceNumber.includes('.') && !containsComma) {
        priceNumber += '.00'
    } else if (containsComma && priceNumber.split(',')[1].length === 1) {
        priceNumber += '0'
    }
    return priceNumber.replace(',', '.').replace(/\./g, '')
}

// Processa os dados em Lista
function processData(data, mappings) {
    const result = {}
    mappings.forEach(mapping => (result[mapping.key] = []))

    // Faz uma cópia dos dados para não modificar o array original
    const dataCopy = [...data]

    // Remove o cabeçalho e armazena em uma variável
    const header = dataCopy.shift()

    // Adiciona o cabeçalho de volta ao result na posição 0
    mappings.forEach(mapping => {
        const key = mapping.key
        
        // Verifica se o header é undefined e substitui por uma string vazia
        const headerValue = header ? (header[mapping.field] || '') : ''
        result[key].push(headerValue)
    })

    // Inverte as linhas se os mapeamentos forem para o menu
    if (mappings === menuMappings) {
        dataCopy.reverse()
    }

// Preenche o result com dados do CSV
dataCopy.forEach((item, index) => {
    mappings.forEach(mapping => {
        let value;
        if (['price', 'deliveryMenFee', 'fee'].includes(mapping.key)) {
            value = processPrice(item[mapping.field]);
        } else {
            value = item[mapping.field];
        }        
        if (mapping.key === 'additional') {
            // Verifica se é do menu ou dos adicionais
            if (mappings === menuMappings) {
                // Trata os dados adicionais do menu
                if (typeof value !== 'undefined') {
                    value = value === '' ? [''] : value.split(',').map(additional => additional.trim())
                } else {
                    value = ['']
                }
            } else {
                // Trata os dados adicionais dos adicionais
                value = typeof value !== 'undefined' ? value : ''
            }
        }
        if (mapping.key === 'quantity') {
            value = value.split(',').map(additional => additional.trim());
        }
        if (typeof value === 'undefined') {
            result[mapping.key].push('')
        } else {
            result[mapping.key].push(value)
        }
    })
})

    // Verifica se os mapeamentos são para o cardápio e adiciona o aviso, se necessário
    if (mappings === menuMappings) {
        result.category.splice(1, 0, 'Avisos')
        result.product.splice(1, 0, 'Para pagamento via pix, utilizar chave: ')
        result.price.splice(1, 0, '0')
        result.description.splice(1, 0, 'Enviar comprovante de pagamento para o contato: ')
        result.additional.splice(1, 0, ['']) // Adiciona um array contendo uma string vazia
        result.code.splice(1, 0, '')
    }

    return result
}


// Mappings dos arays
const additionalsMappings = [
    { key: 'additional', field: 'Adicional' },
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
    { key: 'additional', field: 'Adicional' },
    { key: 'code', field: 'Código' }
]
const neighborhoodsMappings = [
    { key: 'neighborhood', field: 'Bairro' },
    { key: 'fee', field: 'Taxa' },
    { key: 'deliveryMenFee', field: 'Entregador' }
]

// Exportações
module.exports = {
    processCSV,
    additionalsMappings,
    menuMappings,
    neighborhoodsMappings
}
