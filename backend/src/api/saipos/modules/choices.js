import { Choice } from "./../Classes/Choice.js";
import { auxiliarVar } from "./../../../config/variables.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function choices(quickData) {
    const operations = [];
    const everyResults = [];
    let previousChoice = null
    let choiceToPost = null
    
    try { 
        const idStoreVariation = await fetchSaipos({
            method: "GET",
            byEndpoint: "variations",
            findValue: "Único",
            atKey: "desc_store_variation",
            andReturn: "id_store_variation"
        })
        everyResults.push(idStoreVariation)
        
        for (const choiceData of quickData.data) {
            if (!choiceData.choice) continue
            const words = choiceData.choice.split(" ")
            let isFlavor, isCrust, isDough, isOther, isPizza
            isPizza = words.some(item => auxiliarVar.pizza.includes(item))
            isFlavor = words.some(item => auxiliarVar.pizzaFlavor.includes(item) && isPizza)
            isCrust = words.some(item => auxiliarVar.pizzaCrust.includes(item) && isPizza)
            isDough = words.some(item => auxiliarVar.pizzaDough.includes(item) && isPizza) 
            isOther = !(isPizza)
            
            if (choiceData.choice !== previousChoice) {
                if (choiceToPost) {
                    operations.push(fetchSaipos({
                        method: "POST",
                        byEndpoint: "choices",
                        insertData: choiceToPost
                    }))
                }

                const minChoices = parseInt(choiceData.quantity[0])
                const maxChoices = parseInt(choiceData.quantity[1])
                choiceToPost = new Choice({
                    desc_store_choice: choiceData.choice,
                    min_choices: isDough ? 1 : minChoices,
                    max_choices: isDough ? 1 : maxChoices,
                    choice_type: minChoices === 1 && maxChoices === 1 ? 2 : 1,
                    calc_method: isOther || isDough ? 1 : quickData.apportionmentBigger ? 3 : 2,
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
            operations.push(fetchSaipos({
                method: "POST",
                byEndpoint: "choices",
                insertData: choiceToPost
            }))
        }
        
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering choices.", error)
    } finally {
        console.log(JSON.stringify(everyResults))
        return everyResults.filter(result => result.error)
    }
}