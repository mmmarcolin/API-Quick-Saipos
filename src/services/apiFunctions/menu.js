const { getFromSaipos, postToSaipos, deleteFromSaipos } = require("../requestsToSaipos.js")
const{ auxiliarVar, API_BASE_URL } = require("../../utils/auxiliarVariables.js")


class Category {
  constructor(data) {
    this.desc_store_category_item = data.desc_store_category_item
    this.id_store_taxes_data = data.id_store_taxes_data
    this.print_type = data.print_type
    this.enabled = "Y"
    this.id_store_category_item = 0
    this.order = data.order
    this.average_preparation_time = 20
    this.background_color = null
    this.id_store_item_required = null
  }
}

class Product {
  constructor(data) {
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
    this.order = data.store
    this.categories = []
    this.choices = []
    this.availability = []
    this.production_owner = "P"
    this.cod_gtin = null
    this.variations = [{
      id_store_item_variation: 0,
      id_store_item: 0,
      id_store_variation: data.id_store_variation,
      price: data.price,
      order: data.order,
      enabled: "Y",
      variation: {
        id_store: storeId,
        id_store_variation: data.id_store_variation,
        desc_store_variation: "Único",
        desc_store_variation_delivery: null,
        generic_use: "N",
        is_unique: "Y"
      },
      ingredients: []
    }]
  }

  getItemType(desc_store_item) {
    const splittedProduct = desc_store_item.split(' ')
    const isPizza = splittedProduct.some(item => auxiliarVar.pizza.includes(item)) && !splittedProduct.some(item => auxiliarVar.foldedPizza.includes(item))
    return isPizza ? "pizza" : "other"
  }

  addChoice(data) {
    this.choices.push({ 
      id_store_choice: data.id_store_choice,
      order: data.order,
      id_store_item: 0, 
      id_store_item_choice: 0
    })
  }
}

async function deleteCategory(categoryName) {
  const originalCategoryId = await getFromSaipos("desc_store_category_item", categoryName, "id_store_category_item", `${API_BASE_URL}/stores/${storeId}/categories_item`)
  await deleteFromSaipos(`${API_BASE_URL}/stores/${storeId}/categories_item/${originalCategoryId}`)
}

async function executePromisesInChunks(promises, chunkSize) {
  for (let i = 0; i < promises.length; i += chunkSize) {
    const chunk = promises.slice(i, i + chunkSize)
    await Promise.all(chunk)
  }
}

async function getChoicesIds(choicesMenu) {
  const choicePromises = choicesMenu.map(choice => 
    getFromSaipos("desc_store_choice", choice, "id_store_choice", `${API_BASE_URL}/stores/${storeId}/choices`)
  )
  return Promise.all(choicePromises)
}

async function menu(chosenData, storeId) {
  try {
    const [foodTaxId, drinkTaxId, idStoreVariation] = await Promise.all([
      getFromSaipos("desc_store_taxes_data", "Comida", "id_store_taxes_data", `${API_BASE_URL}/stores/${storeId}/taxes_datas`),
      getFromSaipos("desc_store_taxes_data", "Bebidas", "id_store_taxes_data", `${API_BASE_URL}/stores/${storeId}/taxes_datas`),
      getFromSaipos("desc_store_variation", "Único", "id_store_variation", `${API_BASE_URL}/stores/${storeId}/variations`)
    ])

    await Promise.all([
      deleteCategory("Comida"),
      deleteCategory("Bebidas")
    ])

    const uniqueCategories = [...new Set(chosenData.map(item => item.category))]
    let postCategoriesPromises = []

    uniqueCategories.forEach((name, i) => {
      const words = name.split(' ')
      const isDrink = words.some(item => auxiliarVar.drinks.includes(item))
      const categoryToPost = new Category({
        desc_store_category_item: name,
        id_store_taxes_data: isDrink ? drinkTaxId : foodTaxId,
        print_type: isDrink ? 3 : 2,
        order: uniqueCategories.length - i - 1
      })
      postCategoriesPromises.push(postToSaipos(categoryToPost, `${API_BASE_URL}/stores/${storeId}/categories_item`))
    })

    await executePromisesInChunks(postCategoriesPromises, 50)

    let postProductsPromises = []

    const categoryIds = await Promise.all(
      chosenData.map(item => getFromSaipos("desc_store_category_item", item.category, "id_store_category_item", `${API_BASE_URL}/stores/${storeId}/categories_item`))
    )

    chosenData.forEach(async (item, i) => {
      const productToPost = new Product({
        desc_store_item: item.product,
        id_store_category_item: categoryIds[i],
        detail: item.description,
        identifier_number: item.code,
        price: item.price,
        id_store_variation: idStoreVariation,
        order: i
      })

      if (item.choiceMenu[0] !== "") {
        const choiceIds = await getChoicesIds(item.choiceMenu)
        choiceIds.forEach((choiceId, j) => {
          productToPost.addChoice({
            id_store_choice: choiceId,
            order: j
          })
        })
      }
      postProductsPromises.push(postToSaipos(productToPost, `${API_BASE_URL}/stores/${storeId}/items`))
    })

    await executePromisesInChunks(postProductsPromises, 50)

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CARDÁPIO', error)
    return ["CARDÁPIO: ",  { stack: error.stack }]
  }
}

module.exports = menu
