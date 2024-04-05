const formData = {
    storeId: 33738,
    paymentTypesChosen: {
        pix: false,
        elo: false,
        master: false,
        visa: false,
        amex: false,
        hiper: false
    },
    partnersChosen: {
        deliverySite: false,
        basicMenu: false,
        premiumMenu: false,
        pickupCounter: "",
        storeName: "",
        minimumValue: 0,
        startTime: "",
        endTime: "",
        weekDays: {
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false 
        }
    },
    settingsChosen: {
        col42: false,
        kds: false,
        cancelReason: false,
        cancelPassword: false,
        admPermissions: false
    },
    saleStatusChosen: {
        delivery: false,
        easyDelivery: false
    },
    tableOrderChosen: {
        quantity: 0
    },
    orderCardChosen: {
        quantity: 0
    },
    storeDataChosen: {
        cest: false,
        contigency: false












    },
    shiftsChosen: {
        shiftDesc: [],
        shiftTime: [],
        shiftCharge: []
    },
    waitersChosen: {
        waiterDesc: [],
        waiterDailyRate: []
    },
    usersChosen: {
        counterUser: false,
        waiterUserQuantity: 0,
        UserDesc: [],
        storeName: ""
    },
    deliveryMenChosen: {
        deliveryMenQuantity: [],
        deliveryMenDailyRate: []
    },
    districtsChosen: {
        // state: "Tocantins",
        // city: "Palmas",
        // districtsData: {
        //     districts: ["a", "1001 Sul", "1001 S", "1002 Sul", "1003 Sul", "1004 Sul", "1005 Sul", "1006 Sul", "1007 Sul", "101 Norte", "103 Norte", "103 S", "103 Sul", "104 Norte", "104 Sul", "105 Norte", "106 Norte", "106 S", "106 Sul", "107 Norte", "108 Norte", "108 S", "108 Sul", "1103 Sul", "1104 Sul", "1105 Sul", "1106 Sul", "110 Norte", "110 Sul", "1112 Sul", "112 Norte", "112 Sul", "1203 Sul", "1204 Sul", "1205 Sul", "1206 Sul", "1212 Sul", "1303 Sul", "1304 Sul", "1305 Sul", "1306 Sul", "1307 Sul", "1503 Sul", "201 Sul", "202 Sul", "203 Norte", "203 Sul", "204 Sul", "205 Sul", "206 Sul", "207 Norte", "207 Sul", "208 Norte", "208 Sul", "209 Sul", "210 Sul", "212 Norte", "212 Sul", "301 Norte", "302 Norte", "303 Norte", "303 Sul", "304 Norte", "304 Sul", "305 Norte", "305 Sul", "306 Sul", "307 Norte", "307 Sul", "308 Sul", "309 norte", "309 Sul", "401 Norte", "401 Sul", "402 Norte", "402 Sul", "403 Norte", "403 Sul", "404 Norte", "404 Sul", "405 Norte", "405 Sul", "406 Norte", "407 Norte", "407 Sul", "408 Norte", "409 Norte", "409 Sul", "501 Norte", "501 Sul", "502 Norte", "502 Sul", "503 Norte", "503 sul", "504 Norte", "504 Sul", "505 Sul", "506 Norte", "506 Sul", "507 Sul", "508 Norte", "509 Sul", "512 Sul", "601 Sul", "602 Sul", "603 Norte", "603 Sul", "604 Norte", "604 Sul", "605 Norte", "605 Sul", "606 Norte", "606 Sul", "607 Norte", "607 Sul", "611 Sul", "612 Sul", "701 Sul", "702 Sul", "704 Sul", "706 Sul", "712 Sul", "802 Sul", "804 Sul", "806 Sul", "901 Sul", "902 Sul", "903 Sul", "904 Sul", "905 Sul", "906 Sul", "912 Sul", "Água Fria", "Arne", "Arne 81", "Arne 81 Bairro Santo Amaro", "Arno", "Arse", "Arso", "Lago Norte", "Loteamento Água Fria", "Orla 14 Graciosa", "Plano Diretor Norte", "Plano Diretor Sul", "Santo Amaro", "Vila Militar"],
        //     deliveryFee: ["Taxa", 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 15.00, 8.00,7.00,6.99,7.00,6.00,6.00,7.00,6.00,7.99,7.00,8.00,7.00,7.99,7.00,15.00, 15.00, 15.00, 15.00, 8.00,8.00,15.00, 9.00,9.00,15.00, 15.00, 15.00, 15.00, 15.00, 20.00, 20.00, 20.00, 20.00, 20.00, 20.00, 8.00,8.00,8.00,8.00,8.00,8.00,8.00,10.00, 8.00,9.00,8.00,9.00,8.00,10.00, 8.00,8.00,8.00,8.00,8.00,7.00,7.00,8.00,9.00,8.00,8.00,8.00,8.00,9.00,9.00,8.00,8.00,8.00,8.00,8.00,8.00,8.00,8.00,9.00,9.00,9.00,9.00,9.00,10.00, 9.00,10.00, 10.00, 8.00,9.00,9.00,10.00, 8.00,9.00,9.00,9.00,10.00, 9.00,10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 12.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00, 12.00, 6.99,12.99,12.00, 6.99,8.99,10.99,15.00, 15.00, 12.00, 7.99,17.99,12.00, 15.00],
        //     deliveryMenFee: ["a", 15.00,15.00,15.00,15.00,15.00,15.00,15.00,15.00, 8.00, 7.00, 0.00, 7.00, 6.00, 6.00, 7.00, 6.00, 0.00, 7.00, 8.00, 7.00, 0.00, 7.00,15.00,15.00,15.00,15.00, 8.00, 8.00,15.00, 9.00, 9.00,15.00,15.00,15.00,15.00,15.00,20.00,20.00,20.00,20.00,20.00,20.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00,10.00, 8.00, 9.00, 8.00, 9.00, 8.00,10.00, 8.00, 8.00, 8.00, 8.00, 8.00, 7.00, 7.00, 8.00, 9.00, 8.00, 8.00, 8.00, 8.00, 9.00, 9.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00, 9.00, 9.00, 9.00, 9.00, 9.00,10.00, 9.00,10.00,10.00, 8.00, 9.00, 9.00,10.00, 8.00, 9.00, 9.00, 9.00,10.00, 9.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,12.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,10.00,12.00, 0.00, 0.00,12.00, 0.00, 0.00, 0.00,15.00,15.00,12.00, 0.00, 0.00,12.00,5.00]
        // }
    },
    choicesChosen: {
        // biggerCalc: true,
        // proportionalCalc: this.biggerCalc == true ? false : true,
        // choicesData: {
        //     choice: [
        //         "Complemento Açaí", "Complemento Açaí", "Complemento Açaí", "Complemento Açaí", "Complemento Açaí",
        //         "Cobertura Açaí", "Cobertura Açaí", "Cobertura Açaí", "Cobertura Açaí", "Cobertura Açaí",
        //         "Extras Açaí", "ÁGua Ou Leite", "ÁGua Ou Leite", "Fritas Ou Nugget", "Fritas Ou Nugget",
        //         "Escolha O Refrigerante", "Escolha O Refrigerante", "Escolha O Refrigerante", "Escolha O Refrigerante"
        //     ],
        //     item: [
        //         "Leite Em Pó", "Paçoca", "Amendoim", "Granola", "Granulado",
        //         "Morango", "Chocolate", "Menta", "Caramelo", "Leite Condensado",
        //         "Banana", "Com ÁGua", "Com Leite", "Fritas", "Nugget",
        //         "Coca-cola Zero 2l", "Coca-cola 2l", "Guaraná Antarctica 2l", "Guaraná Kuat 2l"
        //     ],
        //     price: [
        //         "0", "0", "0", "0", "0", 
        //         "0", "0", "0", "0", "0", 
        //         "1", "0", "1", "0", "0", 
        //         "0", "0", "0", "0"
        //     ],
        //     description: [
        //         "", "", "", "", "", 
        //         "", "", "", "", "", 
        //         "", "", "", "", "", 
        //         "", "", "", ""
        //     ],
        //     quantity: [
        //         "0,2", "0,2", "0,2", "0,2", "0,2", 
        //         "0,1", "0,1", "0,1", "0,1", "0,1", 
        //         "0,1", "1,1", "1,1", "1,1", "1,1", 
        //         "1,1", "1,1", "1,1", "1,1"
        //     ],
        //     code: [
        //         "", "", "", "", "", 
        //         "", "", "", "", "", 
        //         "", "", "", "", "", 
        //         "", "", "", ""
        //     ],
        // }
    },
    menuChosen: {
        // menuData: {
        //     category: [
        //         "Categoria",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Almoços",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Lanches",
        //         "Bebidas Geladas",
        //         "Bebidas Geladas",
        //         "Bebidas Geladas",
        //         "Bebidas Geladas",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Bebidas Quentes",
        //         "Doces",
        //         "Doces",
        //         "Doces",
        //         "Doces",
        //         "Doces",
        //         "Saladas",
        //         "Saladas",
        //         "Saladas",
        //         "Sem Gluten e Sem Lactose",
        //         "Sem Gluten e Sem Lactose",
        //         "Sem Gluten e Sem Lactose"
    //         ],
        //     product: [
        //         "Produto",
        //         "Filé ao Molho Gorgonzola",
        //         "Fettuccine à Bolonhesa",
        //         "Filé à Parmegiana",
        //         "Strogonoff de Frango",
        //         "Filé de Tilápia com Purê de Batata",
        //         "Espaguete Integral com Almôndegas",
        //         "Filé ao Molho Champagne",
        //         "Frango ao Molho de Mostarda",
        //         "Escondidinho de Frango com Purê de Batata Doce",
        //         "Frango à Parmegiana",
        //         "Costelinha Suína ao Molho Barbecue",
        //         "Risoto de Carne de Panela com Pimentão",
        //         "Lasanhas",
        //         "Strogonoff de Filé",
        //         "Risoto Caprese",
        //         "Risoto de Parmesão com Filé de Frango",
        //         "Frango ao Molho Parmesão",
        //         "Croissant",
        //         "Torrada dupla",
        //         "Sanduíche de pão de queijo",
        //         "Pão de Queijo",
        //         "Fagotto",
        //         "Torrada simples",
        //         "Omelete",
        //         "Folhados",
        //         "Empanadas",
        //         "Sanduíche natural com frango",
        //         "Sanduíche natural",
        //         "Pizza em fatia",
        //         "Whap",
        //         "Suco Natural",
        //         "Limonada Saborizada",
        //         "Frappê",
        //         "Soda Italiana",
        //         "Chocolate Quente Sensação",
        //         "Carioca",
        //         "Chocolate Quente",
        //         "Capuccino",
        //         "Chocotella",
        //         "Chá Twinings",
        //         "Pingado",
        //         "Espresso Duplo",
        //         "Mocaccino",
        //         "Espresso",
        //         "Café Passado",
        //         "Irish Coffee",
        //         "Bolo (fatias)",
        //         "Brownie e Brownie Fit",
        //         "Pão de queijo recheado",
        //         "Mix de Frutas",
        //         "Brigadeiros",
        //         "Salada com Frango Grelhado",
        //         "Salada com Tilápia Grelhada",
        //         "Salada",
        //         "Salgado protéico de frango",
        //         "Pastel funcional de carne",
        //         "Coxinha fit de aipim"
        //     ],
        //     price: [
        //         "Preço",
        //         35.90,
        //         26.90,
        //         35.90,
        //         28.90,
        //         32.90,
        //         29.90,
        //         35.90,
        //         28.90,
        //         28.90,
        //         29.90,
        //         32.90,
        //         29.90,
        //         29.90,
        //         33.90,
        //         29.90,
        //         29.90,
        //         29.90,
        //         9.00,
        //         10.00,
        //         8.00,
        //         5.00,
        //         9.00,
        //         7.50,
        //         12.00,
        //         8.50,
        //         8.00,
        //         12.50,
        //         9.50,
        //         12.00,
        //         14.00,
        //         8.00,
        //         9.00,
        //         15.00,
        //         8.50,
        //         18.00,
        //         6.00,
        //         12.00,
        //         10.00,
        //         20.00,
        //         6.00,
        //         8.50,
        //         8.00,
        //         12.00,
        //         6.00,
        //         9.00,
        //         22.00,
        //         8.00,
        //         8.00,
        //         8.00,
        //         12.00,
        //         6.50,
        //         28.90,
        //         30.90,
        //         18.00,
        //         12.00,
        //         12.00,
        //         12.00
        //     ],
        //     description: [
        //         "Descrição",
        //         "Acompanha arroz e salada",
        //         "Acompanha salada",
        //         "Acompanha arroz e salada",
        //         "Acompanha batata palha, arroz e salada",
        //         "Acompanha arroz e salada",
        //         "Acompanha salada",
        //         "Acompanha arroz e salada",
        //         "Acompanha arroz e salada",
        //         "Acompanha arroz e salada",
        //         "Acompanha arroz e salada",
        //         "Acompanha arroz e salada",
        //         "",
        //         "Carne de panela e Frango. Acompanha arroz e salada",
        //         "Acompanha batata palha, arroz e salada",
        //         "",
        //         "Acompanha alface e tomate",
        //         "Acompanha arroz e salada de alface e tomate",
        //         "Consultar sabores e disponibilidade",
        //         "Requeijão, 2x presunto, 2x queijo",
        //         "",
        //         "",
        //         "Consultar sabores e disponibilidade",
        //         "Requeijão, presunto e queijo",
        //         "Ovo, orégano, sal e queijo",
        //         "Consultar sabores e disponibilidade",
        //         "Consultar sabores e disponibilidade",
        //         "Pão fatiado sem casca, frango desfiado, maionese, queijo, cenoura, alface",
        //         "Pão fatiado sem casca, requeijão, presunto, queijo, cenoura, alface",
        //         "Sabores: Calabresa, frango com requeijão, quatro queijos, milho com bacon, strogonoff de frango",
        //         "Frango desfiado, queijo, cenoura, alface, tomate",
        //         "Laranja, maracujá, abacaxi, etc.",
        //         "Consultar sabores disponíveis",
        //         "Café gelado",
        //         "Consultar sabores disponíveis",
        //         "Chocolate quente, calda de morango e chantilly",
        //         "Café espresso suave",
        //         "Adicional chantilly - R$ 4,00",
        //         "Adicional chantilly - R$ 4,00",
        //         "Chocolate quente com Nutella e chantilly",
        //         "Consultar sabores",
        //         "Café com leite",
        //         "",
        //         "café espresso, leite vaporizado, calda de chocolate amargo",
        //         "",
        //         "Café passado com filtro hario V60",
        //         "Café com whisky irlandês",
        //         "Consultar sabor e disponibilidade",
        //         "Consultar valores e disponibilidade de sabores",
        //         "Doce de leite ou nutella",
        //         "",
        //         "Consultar sabor e disponibilidade",
        //         "Filé de frango grelhado, alface, tomate cereja, cenoura ralada, pepino japonês. Acompanha molho da casa e parmesão ralado",
        //         "Filé de tilápia grelhada, alface, tomate cereja, cenoura ralada, pepino japonês. Acompanha molho da casa e parmesão ralado",
        //         "Alface, tomate, cenoura ralada, pepino japonês. Acompanha molho da casa e parmesão ralado",
        //         "",
        //         "",
        //         "",
        //         ""
        //     ],
        //     choice: [
        //         "add",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         ""
        //     ],            
        //     code: [
        //         "add",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         "",
        //         ""
        //     ],     
        // }
    },
    time: {}
}
  
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

const normalizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "").toLowerCase()

module.exports = { storeId: formData.storeId, auxiliarVar: auxiliarVar, formData, API_BASE_URL, normalizeText }
