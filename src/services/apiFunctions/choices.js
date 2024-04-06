async function choices(chosenData) {
  try {
    const getResults = await Promise.all([
      getFromSaipos("desc_store_variation", "Único", "id_store_variation", `${API_BASE_URL}/stores/${storeId}/variations`)
    ])

    const idStoreVariation = getResults[0]

    let previousChoice = null
    let choiceToPost = null
    let postPromises = []

    for (const choiceData of chosenData.choicesData) {
      const isFlavor = choiceData.choice.split(' ').some(item => auxiliarVar.pizza.includes(item) && auxiliarVar.pizzaFlavor.includes(item))
      const isCrust = choiceData.choice.split(' ').some(item => auxiliarVar.pizza.includes(item) && auxiliarVar.pizzaCrust.includes(item))
      const isDough = choiceData.choice.split(' ').some(item => auxiliarVar.pizza.includes(item) && auxiliarVar.pizzaDough.includes(item)) 
      const isOther = !(isFlavor || isCrust || isDough)

      if (choiceData.choice !== previousChoice) {
        if (choiceToPost) {
          postPromises.push(postToSaipos(choiceToPost, `${API_BASE_URL}/stores/${storeId}/choices`))
        }

        choiceToPost = new Choice({
          desc_store_choice: choiceData.choice,
          min_choices: isDough ? 1 : parseInt(choiceData.quantity[0]),
          max_choices: isDough ? 1 : parseInt(choiceData.quantity[1]),
          choice_type: isOther || isDough ? 2 : 1,
          calc_method: isOther || isDough ? 1 : auxiliarVar.biggerCalc ? 3 : 2,
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