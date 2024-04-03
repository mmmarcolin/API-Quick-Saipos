const { getFromSaipos, postToSaipos } = require("../../utils/requestsToSaipos.js")
const { storeId, auxiliarVar } = require("../../utils/auxiliarVariables.js")

module.exports = async function additionals(chosedData) {
  try {
    class Category {
      constructor(data) {
        this.desc_store_category_item = data.desc_store_category_item
        this.id_store_taxes_data = data.desc_store_category_item.split(' ').some(item => drinks.includes(item)) ? drinkTaxId : foodTaxId
        this.print_type = data.desc_store_category_item.split(' ').some(item => drinks.includes(item)) ? 3 : 2
        this.enabled = "Y"
        this.id_store_category_item = 0
        this.order = 0
        this.average_preparation_time = 20
        this.background_color = null
        this.id_store_item_required = null
      }
    }
    
    class Product {
      constructor(data) {
        this.id_store = storeId
        this.id_store_item = 0
        this.item_type = data.item_type
        this.id_store_category_item = data.id_store_category_item
        this.id_store_taxes_data = null
        this.desc_store_item = data.desc_store_item
        this.desc_store_item_delivery = null
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
        this.variations = [
          {
            "id_store_item_variation": 0,
            "id_store_item": 0,
            "id_store_variation": data.id_store_variation,
            "price": data.price,
            "order": 0,
            "enabled": "Y",
            "variation": {
              "id_store": storeId,
              "id_store_variation": data.id_store_variation,
              "desc_store_variation": "Único",
              "desc_store_variation_delivery": null,
              "generic_use": "N",
              "is_unique": "Y"
            },
            "ingredients": []
          }
        ]
      }

      linkAdd(productAdditional) {
        this.choice_items.push(new Additional(productAdditional))
      }
    }

    class Additional {
      constructor(data) {
        this.id_store_choice = data.id_store_choice
      }
    }

    const foodTaxId = await getFromSaipos("desc_store_taxes_data", "Comida", "id_store_taxes_data", `https://api.saipos.com/v1/stores/${storeId}/taxes_datas`)
    const drinkTaxId = await getFromSaipos("desc_store_taxes_data", "Bebida", "id_store_taxes_data", `https://api.saipos.com/v1/stores/${storeId}/taxes_datas`)
    const idStoreVariation = await getFromSaipos("desc_store_variation" , "Único", "id_store_variation" , `https://api.saipos.com/v1/stores/${storeId}/variations`)
    const uniqueCategories = [...new Set(chosedData.menuData.category)]

    for (let i = 0; i < uniqueCategories.length; i++) {
      let categoryToPost = new Category({
        desc_store_category_item: uniqueCategories[i]
      })
      await postToSaipos(categoryToPost, `https://api.saipos.com/v1/stores/${storeId}/categories_item`)
    }

    for (let i = 1; i < chosedData.menuData.product.length; i++) {

      let splittedProduct = menuData.product[i].split(' ')
      const isPizza = splittedProduct.some(item => auxiliarVar.pizza.includes(item)) && !splittedProduct.some(item => auxiliarVar.foldedPizza.includes(item))
      const isCombo = isPizza && (splittedProduct.some(item => auxiliarVar.combo.includes(item)) || splittedProduct.includes("+"))
      const isOther = (isPizza || isCombo) ? false : true

      let categoryId = await getFromSaipos("desc_store_category_item", chosedData.menuData.category[i], "id_store_category_item", `https://api.saipos.com/v1/stores/${storeId}/categories_item`)

      let productToPost = new Product({
        desc_store_category_item: chosedData.menuData.category,
        item_type: isOther ? "other" : "pizza",
        id_store_category_item: categoryId,
        identifier_number: chosedData.menuData.code,
        desc_store_item: chosedData.menuData.product,
        detail: chosedData.menuData.description,
        price: isCombo ? chosedData.menuData.price : 0,
        id_store_variation: idStoreVariation
      })

      for (let j = 0; j < chosedData.menuData.additional[i].length; j++) {
        let additionalId = await getFromSaipos("desc_store_choice", chosedData.menuData.additional[i][j], "id_store_choice", `https://api.saipos.com/v1/stores/${storeId}/choices`)
        productToPost.linkAdd({
          id_store_choice: additionalId
        })
      }

      postToSaipos(productToPost, `https://api.saipos.com/v1/stores/${storeId}/items`)
    }

  } catch (error) {
    console.error('Ocorreu um erro durante o cadastro de CARDÁPIO', error)
    return  ["CARDÁPIO: ",{ stack: error.stack }]
  }
}