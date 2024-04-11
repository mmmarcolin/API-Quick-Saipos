const auxiliarVar = {
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

const API_BASE_URL = "https://api.saipos.com/v1"

const normalizeText = (text) => text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "").toLowerCase()

module.exports = { auxiliarVar: auxiliarVar, API_BASE_URL, normalizeText }
