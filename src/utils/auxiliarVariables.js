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
    taxesDataChosen: {
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
        state: "",
        city: "",
        districtsData: {
            districts: [],
            deliveryFee: [],
            deliveryMenFee: []
        }
    },
    choicesChosen: {
        // biggerCalc: true,
        // proportionalCalc: this.biggerCalc == true ? false : true,
        // choicesData: {
        //     choice: [
        //         "Adicional",
        //         "AdicionalNome",
        //         "AdicionalNome",
        //         "AdicionalNome2",
        //         "AdicionalNome3"
        //     ],
        //     item: [
        //         "Item",
        //         "Item1",
        //         "Item2",
        //         "Item3",
        //         "Item3"
        //     ],
        //     price: [
        //         "Preço",
        //         2,
        //         4,
        //         6,
        //         8
        //     ],
        //     description: [
        //         "Descrição",
        //         "Desc1",
        //         "Desc2",
        //         "Desc3",
        //         "Desc4"
        //     ],
        //     quantity: [
        //         "Quantidade",
        //         "1,1",
        //         "1,1",
        //         "1,2",
        //         "1,3"],
        //     code: [
        //         "Código",
        //         "",
        //         "",
        //         "",
        //         ""
        //     ],
        // }
    },
    menuChosen: {
        // menuData: {
        //     category: [
        //         "Categoria",
        //         "CategoriaNome",
        //         "CategoriaNome",
        //         "CategoriaNome2",
        //         "CategoriaNome3"
        //     ],
        //     product: [
        //         "Item",
        //         "Pizza",
        //         "Item2",
        //         "Item3",
        //         "Item3"
        //     ],
        //     price: [
        //         "Preço",
        //         2,
        //         4,
        //         6,
        //         8
        //     ],
        //     description: [
        //         "Descrição",
        //         "Desc1",
        //         "Desc2",
        //         "Desc3",
        //         "Desc4"
        //     ],
        //     choice: [
        //         "Adicional",
        //         "AdicionalNome",
        //         "AdicionalNome, AdicionalNome2",
        //         "1, AdicionalNome",
        //         "AAAAAAA, AdicionalNome"],
        //     code: [
        //         "Código",
        //         "2",
        //         "3",
        //         "4",
        //         "5"
        //     ],
        // }
    }
}
  
const auxiliarVar = {
    drinks: [
        'Refrigerantes', 'Refrigerante', 'Sucos', 'Suco', 'Bebidas',
        'Bebida', 'Cervejas', 'Cerveja', 'Drinks', 'Coquetéis',
        'Água', 'Águas', 'Doses', 'Longneck', 'Longnecks',
        'Long neck', 'Long necks', 'Aguas', 'Agua', 'Coqueteis',
        'refrigerantes', 'refrigerante', 'sucos', 'suco', 'bebidas',
        'bebida', 'cervejas', 'cerveja', 'drinks', 'coquetéis',
        'água', 'águas', 'doses', 'longneck', 'longnecks',
        'long neck', 'long necks', 'aguas', 'agua', 'coqueteis',
        'REFRIGERANTES', 'REFRIGERANTE', 'SUCOS', 'SUCO', 'BEBIDAS',
        'BEBIDA', 'CERVEJAS', 'CERVEJA', 'DRINKS', 'COQUETÉIS',
        'ÁGUA', 'ÁGUAS', 'DOSES', 'LONGNECK', 'LONGNECKS',
        'LONG NECK', 'LONG NECKS', 'AGUAS', 'AGUA', 'COQUETEIS'
    ], 
    pizzaDough: [
        'Massa', 'MASSA', 'massa', 
        'Massas', 'MASSAS', 'massas'
    ],
    pizzaCrust: [
        'Borda', 'BORDA', 'borda',
        'Bordas', 'BORDAS', 'bordas'
    ],
    pizzaFlavor: [
        'Sabor', 'SABOR', 'sabor',
        'Sabores', 'SABORES', 'sabores'
    ],
    pizza: [
        'Pizza', 'PIZZA', 'pizza',
        'Pizzas', 'PIZZAS', 'pizzas'
    ],
    combo: [
        'Combo', 'COMBO', 'combo',
        'Combos', 'COMBOS', 'combos'
    ],
    foldedPizza: [
        'Dobrada', 'DOBRADA', 'dobrada',
        'Dobradas', 'DOBRADAS', 'dobradas'
    ]
}

const API_BASE_URL = 'https://api.saipos.com/v1'

const normalizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "").toLowerCase()

module.exports = { storeId: formData.storeId, auxiliarVar: auxiliarVar, formData, API_BASE_URL, normalizeText }
