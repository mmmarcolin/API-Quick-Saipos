import { Category } from "./../Classes/Category.js";
import { Product } from "./../Classes/Product.js";
import { auxiliarVar } from "./../../../config/variables.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function menu(quickData) {
    const everyResults = [];
    let postProductsPromises = []
    let postCategoriesPromises = []

    async function deleteCategory(categoryName) {
        try {
            const originalCategoryId = await fetchSaipos({
                method: "GET",
                byEndpoint: "categories_item",
                findValue: categoryName,
                atKey: "desc_store_category_item",
                andReturn: "id_store_category_item"
            })
            
            await fetchSaipos({
                method: "DELETE",
                byEndpoint: `categories_item/${originalCategoryId}`
            })
        } catch (error) {
            const message = "Categorias pré existentes já excluidas ou com produtos dentro."
            return { error: true, response: message };
        }
    }

    async function getChoicesIds(choicesMenu) {
        const choicePromises = choicesMenu.map(choice => 
            fetchSaipos({
                method: "GET",
                byEndpoint: "choices",
                findValue: choice,
                atKey: "desc_store_choice",
                andReturn: "id_store_choice" 
            })
        )
        return Promise.all(choicePromises)
    }

    async function getTaxId(categoryName) {
        return await fetchSaipos({
            method: "GET",
            byEndpoint: "taxes_datas",
            findValue: categoryName,
            atKey: "desc_store_taxes_data",
            andReturn: "id_store_taxes_data"
        })
    }

    async function executePromisesInChunks(promises, chunkSize) {
        for (let i = 0; i < promises.length; i += chunkSize) {
            const chunk = promises.slice(i, i + chunkSize)
            everyResults.push(...await Promise.all(chunk))
        }
    }
    
    try {
        const [idStoreVariation, foodTaxId, drinkTaxId] = await Promise.all([
            fetchSaipos({
                method: "GET",
                byEndpoint: "variations",
                findValue: "Único",
                atKey: "desc_store_variation",
                andReturn: "id_store_variation"
            }),
            getTaxId("Comida"),
            getTaxId("Bebidas"),
            deleteCategory("Comida"),
            deleteCategory("Bebidas"),
        ])
        everyResults.push(idStoreVariation, foodTaxId, drinkTaxId)

        const uniqueCategories = [...new Set(quickData.map(item => item.category))]
        uniqueCategories.forEach((name, i) => {
            const words = name.split(" ")
            const isDrink = words.some(item => auxiliarVar.drinks.includes(item))

            postCategoriesPromises.push(fetchSaipos({
                method: "POST",
                byEndpoint: "categories_item",
                insertData: new Category({
                    desc_store_category_item: name,
                    id_store_taxes_data: isDrink ? drinkTaxId : foodTaxId,
                    print_type: isDrink ? 3 : 2,
                    order: i
                })
            }))
        })
        await executePromisesInChunks(postCategoriesPromises, 50)
        
        const categoryIds = await Promise.all(
            quickData.map(item => fetchSaipos({
                method: "GET",
                byEndpoint: "categories_item",
                findValue: item.category,
                atKey: "desc_store_category_item",
                andReturn: "id_store_category_item"
            }))
        )
        everyResults.push(...categoryIds)

        quickData.forEach(async (item, i) => {
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
                everyResults.push(...choiceIds)
                choiceIds.forEach((choiceId, j) => {
                    productToPost.addChoice({
                        id_store_choice: choiceId,
                        order: j
                    })
                })
            }
            
            postProductsPromises.push(fetchSaipos({
                method: "POST",
                byEndpoint: "items",
                insertData: productToPost
            }))
        })
        
        await executePromisesInChunks(postProductsPromises, 50)
    } catch (error) {
        console.error("Error registering menu.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}