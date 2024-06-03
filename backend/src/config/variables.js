// String verification variables
export const auxiliarVar = {
    drinks: [
        "Refrigerantes", "Refrigerante", "Sucos", "Suco", "Bebidas",
        "Bebida", "Cervejas", "Cerveja", "Drinks", "Coquetéis",
        "Água", "Águas", "Doses", "Longneck", "Longnecks",
        "Long neck", "Long necks", "Aguas", "Agua", "Coqueteis",
        "refrigerantes", "refrigerante", "sucos", "suco", "bebidas",
        "bebida", "cervejas", "cerveja", "drinks", "coquetéis",
        "água", "águas", "doses", "longneck", "longnecks",
        "long neck", "long necks", "aguas", "agua", "coqueteis",
        "REFRIGERANTES", "REFRIGERANTE", "SUCOS", "SUCO", "BEBIDAS",
        "BEBIDA", "CERVEJAS", "CERVEJA", "DRINKS", "COQUETÉIS",
        "ÁGUA", "ÁGUAS", "DOSES", "LONGNECK", "LONGNECKS",
        "LONG NECK", "LONG NECKS", "AGUAS", "AGUA", "COQUETEIS"
    ], 
    pizzaDough: [
        "Massa", "MASSA", "massa", 
        "Massas", "MASSAS", "massas"
    ],
    pizzaCrust: [
        "Borda", "BORDA", "borda",
        "Bordas", "BORDAS", "bordas"
    ],
    pizzaFlavor: [
        "Sabor", "SABOR", "sabor",
        "Sabores", "SABORES", "sabores"
    ],
    pizza: [
        "Pizza", "PIZZA", "pizza",
        "Pizzas", "PIZZAS", "pizzas"
    ],
    combo: [
        "Combo", "COMBO", "combo",
        "Combos", "COMBOS", "combos"
    ],
    foldedPizza: [
        "Dobrada", "DOBRADA", "dobrada",
        "Dobradas", "DOBRADAS", "dobradas"
    ]
}

// Text normalizer
export const normalizeText = (text) => 
    text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

// Environment variables
const environmentVariables = {
    API_TOKEN: process.env.API_TOKEN,
    HUBSPOT_TOKEN: process.env.HUBSPOT_TOKEN,
}
export function getEnvVar() { return environmentVariables } 

// Saipos Token
export let saiposToken
export function setSaiposToken(s) { saiposToken = s }

// Store Id
export let storeId
export function setStoreId(s) { storeId = s }