const { getFromSaipos, postToSaipos } = require("../requestsToSaipos.js")
const{ auxiliarVar, API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class Choice {
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

  addItem(data) {
    this.choice_items.push(new Item(data))
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

async function choices(chosenData, storeId) {
  try { 
    const idStoreVariation = await getFromSaipos("desc_store_variation", "Único", "id_store_variation", `${API_BASE_URL}/stores/${storeId}/variations`)

    let previousChoice = null
    let choiceToPost = null
    let postPromises = []

    for (const choiceData of chosenData.data) {
      const words = choiceData.choice.split(' ')
      let isFlavor, isCrust, isDough, isOther, isPizza
      isPizza = words.some(item => auxiliarVar.pizza.includes(item))
      isFlavor = words.some(item => auxiliarVar.pizzaFlavor.includes(item) && isPizza)
      isCrust = words.some(item => auxiliarVar.pizzaCrust.includes(item) && isPizza)
      isDough = words.some(item => auxiliarVar.pizzaDough.includes(item) && isPizza) 
      isOther = !(isPizza)

      if (choiceData.choice !== previousChoice) {
        if (choiceToPost) {
          postPromises.push(postToSaipos(choiceToPost, `${API_BASE_URL}/stores/${storeId}/choices`))
        }

        choiceToPost = new Choice({
          desc_store_choice: choiceData.choice,
          min_choices: isDough ? 1 : parseInt(choiceData.quantity[0]),
          max_choices: isDough ? 1 : parseInt(choiceData.quantity[1]),
          choice_type: isOther || isDough ? 2 : 1,
          calc_method: isOther || isDough ? 1 : chosenData.apportionmentBigger ? 3 : 2,
          group_items_print: isOther ? "Y" : "N",
          kind: isFlavor ? "pizzaFlavor" : isDough ? "pizzaDough" : isCrust ? "pizzaCrust" : "other"
        })
      }

      choiceToPost.addItem({
        desc_store_choice_item: choiceData.item,
        aditional_price: choiceData.price,
        detail: choiceData.description,
        code: choiceData.code,
        id_store_variation: idStoreVariation,
      })

      previousChoice = choiceData.choice
    }

    if (choiceToPost) {
      postPromises.push(postToSaipos(choiceToPost, `${API_BASE_URL}/stores/${storeId}/choices`))
    }

    await Promise.all(postPromises)
  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de ADICIONAIS', error)
    return ["ADICIONAIS: ", { stack: error.stack }]
  }
}

module.exports = choices