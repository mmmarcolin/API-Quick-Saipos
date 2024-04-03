const { getFromSaipos, postToSaipos } = require("../../utils/requestsToSaipos.js")
const { storeId, auxiliarVar } = require("../../utils/auxiliarVariables.js")

module.exports = async function additionals(chosedData) {
  try {
    class Additional {
      constructor(data) {
        this.id_store = storeId
        this.id_store_choice = 0
        this.desc_store_choice = data.desc_store_choice
        this.choice_type = data.choice_type
        this.min_choices = data.min_choices
        this.max_choices = data.max_choices
        this.calc_method = data.calc_method
        this.generic_use = "N"
        this.group_items_print = data.group_items_print
        this.choice_items = []
        this.kind = data.kind
      }

      addItem(choiceItem) {
        this.choice_items.push(new Item(choiceItem))
      }
    }
    
    class Item {
      constructor(data) {
        this.id_store_choice_item = data.id_store_choice_item
        this.desc_store_choice_item = data.desc_store_choice_item
        this.id_store_choice = data.id_store_choice
        this.detail = data.detail
        this.code = data.code
        this.enabled = "Y"
        this.variations = [
          {
            id_store_choice_item_variation: 0,
            id_store_choice_item: data.id_store_choice_item, 
            id_store_variation: data.id_store_variation,
            aditional_price: data.aditional_price,
            enabled: "Y"
          }
        ]
      }
    }
    
    const idStoreVariation = await getFromSaipos("desc_store_variation", "Único", "id_store_variation", `https://api.saipos.com/v1/stores/${storeId}/variations`)
    
    let i = 1, j = 1

    while (chosedData.additionalsData.additional[i] != undefined) {

      let splittedAdditional = chosedData.additionalsData.additional[i].split(' ')
      const isFlavor = splittedAdditional.some(item => auxiliarVar.pizza.includes(item)) && splittedAdditional.some(item => auxiliarVar.pizzaFlavor.includes(item))
      const isCrust = splittedAdditional.some(item => auxiliarVar.pizza.includes(item)) && splittedAdditional.some(item => auxiliarVar.pizzaCrust.includes(item))
      const isDough = splittedAdditional.some(item => auxiliarVar.pizza.includes(item)) && splittedAdditional.some(item => auxiliarVar.pizzaDough.includes(item)) 
      const isOther = (isFlavor || isCrust || isDough) ? false : true

      let additionalToPost = new Additional({
        desc_store_choice: chosedData.additionalsData.additional[i],
        min_choices: isDough ? 1 : parseInt(chosedData.additionalsData.quantity[i].split(",")[0]),
        max_choices: isDough ? 1 : parseInt(chosedData.additionalsData.quantity[i].split(",")[1]),
        choice_type: isOther || isDough ? 2 : 1,
        calc_method: isOther || isDough ? 1 : chosedData.biggerCalc ? 3 : 2,
        group_items_print: isOther ? "Y" : "N",
        kind: isFlavor ? "pizzaFlavor" : isDough ? "pizzaDough" : isCrust ? "pizzaCrust" : "other"
      })

      while (chosedData.additionalsData.additional[j] == chosedData.additionalsData.additional[j-1] || j == i) {
        additionalToPost.addItem({
          desc_store_choice_item: chosedData.additionalsData.item[j],
          aditional_price: chosedData.additionalsData.price[j],
          detail: chosedData.additionalsData.description[j],
          code: chosedData.additionalsData.code[j],
          id_store_choice_item: 0,
          id_store_choice: 0,
          id_store_variation: idStoreVariation,
        })
        j++
      }
      i = j

      await postToSaipos(additionalToPost, `https://api.saipos.com/v1/stores/${storeId}/choices`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ADICIONAIS', error)
    return  ["ADICIONAIS: ",{ stack: error.stack }]
  }
}