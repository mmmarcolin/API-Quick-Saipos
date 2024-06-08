// Imports
import { Readable } from 'stream';
import csv from 'csv-parser';
import iconv from 'iconv-lite';

// Buffer to stream function
const bufferToStream = (buffer) => {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};

// Handle file
export function handleCSV(csvBuffer, type) {
    // Switch between headers
    let mappings = [];
    let headers = [];

    switch (type) {
        case "add":
            headers = ["Adicional", "Item", "Preço", "Descrição", "Quantidade", "Código"];
            mappings = choicesMappings;
            break;
        case "card":
            headers = ["Categoria", "Produto", "Preço", "Descrição", "Adicional", "Código"];
            mappings = menuMappings;
            break;
        case "area":
            headers = ["Área", "Taxa", "Entregador"];
            mappings = deliveryAreasMappings;
            break;
    }
    
    // Return handling
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = bufferToStream(iconv.decode(csvBuffer, 'utf-8'));
        stream
        .pipe(csv({ headers: headers }))
        .on("data", (data) => results.push(data))
        .on("end", () => {
            const processedData = processData(results, mappings);

            if (mappings === menuMappings) {
                processedData.splice(1, 0, {
                    category: "Avisos",
                    product: "Para pagamento via pix, utilizar chave:",
                    price: "0",
                    description: "Enviar comprovante de pagamento para o contato:",
                    choiceMenu: [""],
                    code: ""
                });
            }

            processedData.shift();
            resolve(processedData);
        })
        .on("error", (error) => reject(error));
    });
}

// Handle data
function processData(data, mappings) {
    return data.map(item => {
        const rowObject = {};
        mappings.forEach(mapping => {
            let value = item[mapping.field] || "";

            if (value === undefined || value === null || value.trim() === "") 
                value = (mapping.key === "choiceMenu" || mapping.key === "quantity") ? [""] : "";

            else {
                if (["price", "deliveryMenFee", "deliveryFee", ""].includes(mapping.key)) 
                    value = value.replace(/,/g, ".").replace(/[^\d.]/g, "");

                if ((mapping.key === "choiceMenu" || mapping.key === "quantity") && value) 
                    value = value.split(",").map(part => part.trim());

                if (mapping.key === "description") 
                    value = value.slice(0, 400);
            }
            rowObject[mapping.key] = value;
        });
        return rowObject;
    });
}

// Column variables mapping for choices
const choicesMappings = [
    { key: "choice", field: "Adicional" },
    { key: "item", field: "Item" },
    { key: "price", field: "Preço" },
    { key: "description", field: "Descrição" },
    { key: "quantity", field: "Quantidade" },
    { key: "code", field: "Código" }
];

// Column variables mapping for menu
const menuMappings = [
    { key: "category", field: "Categoria" },
    { key: "product", field: "Produto" },
    { key: "price", field: "Preço" },
    { key: "description", field: "Descrição" },
    { key: "choiceMenu", field: "Adicional" },
    { key: "code", field: "Código" }
];

// Column variables mapping for delivery areas
const deliveryAreasMappings = [
    { key: "deliveryArea", field: "Área" },
    { key: "deliveryFee", field: "Taxa" },
    { key: "deliveryMenFee", field: "Entregador" }
];