const formData = {
    storeId: 33738,
    paymentTypesChosed: {pix: false, elo: false, master: false, visa: false, amex: false, hiper: false},
    partnersChosed: {deliverySite: false, basicMenu: false, premiumMenu: false, pickupCounter: "", storeName: "", minimumValue: 0, startTime: "", endTime: "", weekDays: { sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false }},
    settingsChosed: {col42: false, kds: false, cancelReason: false, cancelPassword: false, admPermissions: false},
    saleStatusChosed: {delivery: false, easyDelivery: false},
    tableOrderChosed: {quantity: 0},
    orderCardChosed: {quantity: 0},
    taxesDataChosed: {cest: false, contigency: false},
    shiftsChosed: {shiftDesc: [], shiftTime: [], shiftCharge: []},
    waitersChosed: {waiterDesc: [], waiterDailyRate: []},
    deliveryMenChosed: {deliveryMenQuantity: [], deliveryMenDailyRate: []},
    usersChosed: {counterUser: false, waiterUserQuantity: 0, storeName: ""},
    neighborhoodsChosed: {stateDesc: "", cityDesc: "", neighborhoodsData: {neighborhoods: [], deliveryFee: [], deliveryMenFee: []}},
    additionalsChosed: {biggerCalc: true, additionalsData: {additional: ["Adicional", "AdicionalNome", "AdicionalNome", "AdicionalNome2", "AdicionalNome3"], item: ["Item", "Item1", "Item2", "Item3", "Item3"], price: ["Preço", 2, 4, 6, 8], description: ["Descrição", "Desc1", "Desc2", "Desc3", "Desc4"], quantity: ["Quantidade", "1,2", "1,2", "1,3", "1,3"], code: ["", "", "", "", ""], }},
    menuChosed: {}
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

module.exports = { storeId: formData.storeId, auxiliarVar: auxiliarVar, formData }
