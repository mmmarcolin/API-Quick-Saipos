const { getFromSaipos, postToSaipos } = require("../requestsToSaipos.js")
const { storeId, auxiliarVar, API_BASE_URL } = require("../../utils/auxiliarVariables.js")

class Category {
  constructor(name) {
    this.desc_store_category_item = name
    this.isDrink = name.split(' ').some(item => auxiliarVar.drinks.includes(item))
    this.id_store_taxes_data = null 
    this.print_type = null
    this.enabled = "Y"
    this.id_store_category_item = 0
    this.order = 0
    this.average_preparation_time = 20
    this.background_color = null
    this.id_store_item_required = null
  }

  async setTaxAndPrintType(foodTaxId, drinkTaxId) {
    this.id_store_taxes_data = this.isDrink ? drinkTaxId : foodTaxId
    this.print_type = this.isDrink ? 3 : 2
  }
}

class Product {
  constructor(data, idStoreVariation) {
    this.id_store = storeId
    this.id_store_item = 0
    this.item_type = this.getItemType(data.desc_store_item)
    this.id_store_category_item = data.id_store_category_item
    this.desc_store_item = data.desc_store_item
    this.detail = data.detail
    this.enabled = "Y"
    this.identifier_number = data.identifier_number
    this.available_delivery = "Y"
    this.available_site_delivery = "Y"
    this.available_digital_menu = "Y"
    this.available_table_order = "Y"
    this.print_type = 1
    this.generic_use = "N"
    this.service_charge = "Y"
    this.decimal_quantity = "N"
    this.order = 1
    this.categories = []
    this.choices = []
    this.availability = []
    this.production_owner = "P"
    this.cod_gtin = null

    const isCombo = this.isCombo(data.desc_store_item)
    const price = isCombo ? data.price : (this.item_type === "pizza" ? 0 : data.price)
    this.variations = [this.createVariation(price, idStoreVariation)]
  }

  getItemType(desc_store_item) {
    const splittedProduct = desc_store_item.split(' ')
    const isPizza = splittedProduct.some(item => auxiliarVar.pizza.includes(item)) && !splittedProduct.some(item => auxiliarVar.foldedPizza.includes(item))
    const isCombo = isPizza && (splittedProduct.some(item => auxiliarVar.combo.includes(item)) || splittedProduct.includes("+"))
    return isCombo ? "combo" : isPizza ? "pizza" : "other"
  }

  isCombo(desc_store_item) {
    const splittedProduct = desc_store_item.split(' ')
    return splittedProduct.some(item => auxiliarVar.combo.includes(item)) || splittedProduct.includes("+")
  }

  createVariation(price, idStoreVariation) {
    return {
      id_store_item_variation: 0,
      id_store_item: 0,
      id_store_variation: idStoreVariation,
      price: price,
      order: 0,
      enabled: "Y",
      variation: {
        id_store: storeId,
        id_store_variation: idStoreVariation,
        desc_store_variation: "Único",
        desc_store_variation_delivery: null,
        generic_use: "N",
        is_unique: "Y"
      },
      ingredients: []
    }
  }

  addChoice(data) {
    this.choices.push({ id_store_choice: data })
  }
}

async function menu(chosenData) {
  try {
    const foodTaxId = await getFromSaipos("desc_store_taxes_data", "Comida", "id_store_taxes_data", `${API_BASE_URL}/stores/${storeId}/taxes_datas`)
    const drinkTaxId = await getFromSaipos("desc_store_taxes_data", "Bebidas", "id_store_taxes_data", `${API_BASE_URL}/stores/${storeId}/taxes_datas`)
    const idStoreVariation = await getFromSaipos("desc_store_variation" , "Único", "id_store_variation" , `${API_BASE_URL}/stores/${storeId}/variations`)

    const uniqueCategories = new Set(chosenData.menuData.category.slice(1))
    for (const name of uniqueCategories) {
      const category = new Category(name)
      await category.setTaxAndPrintType(foodTaxId, drinkTaxId)
      await postToSaipos(category, `${API_BASE_URL}/stores/${storeId}/categories_item`)
    }

    for (let i = 1; i < chosenData.menuData.product.length; i++) {
      const categoryId = await getFromSaipos("desc_store_category_item", chosenData.menuData.category[i], "id_store_category_item", `${API_BASE_URL}/stores/${storeId}/categories_item`)
      const productData = {
        desc_store_item: chosenData.menuData.product[i],
        id_store_category_item: categoryId,
        detail: chosenData.menuData.description[i],
        identifier_number: chosenData.menuData.code[i],
        price: chosenData.menuData.price[i]
      }

      const productToPost = new Product(productData, idStoreVariation)
      const splittedChoices = chosenData.menuData.choice[i].split(",")      
      if (splittedChoices != '') {
        for (const choice of splittedChoices) {
          const choiceId = await getFromSaipos("desc_store_choice", choice, "id_store_choice", `${API_BASE_URL}/stores/${storeId}/choices`)
          productToPost.addChoice(choiceId)
        }
      }
      await postToSaipos(productToPost, `${API_BASE_URL}/stores/${storeId}/items`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CARDÁPIO', error)
    return  ["CARDÁPIO: ", { stack: error.stack }]
  }
}

module.exports = menu