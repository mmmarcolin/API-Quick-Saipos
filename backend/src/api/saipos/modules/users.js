import { User } from "./../Classes/User.js"
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function users(quickData) {
    const operations = [];
    const everyResults = [];
    let userToPrintId

    try {
        if (quickData.users.some(item => item.desc === "Caixa")) {
            userToPrintId = await fetchSaipos({
                method: "POST",
                byEndpoint: "users",
                insertData: new User({
                    full_name: "Caixa",
                    store_name: quickData.domain
                }),
                andReturn: "id_user"
            })
            everyResults.push(userToPrintId)
            quickData.users = quickData.users.filter(user => user.desc !== "Caixa")
        } else {
            const allUsers= await fetchSaipos({
                method: "GET",
                byEndpoint: "find-all-users",
                findValue: "every",
                andReturn: "",
            })
            everyResults.push(allUsers)
            const oldestUser = allUsers.reduce((oldest, item) => {
                return (new Date(oldest.user.created_at) < new Date(item.user.created_at)) ? oldest : item;
            });
            userToPrintId = oldestUser.id_user
        }
        console.log("userToPrintId", userToPrintId)
        
        if (quickData.users.length > 0 ) {
            for (const usersData of quickData.users) {
                operations.push(fetchSaipos({
                    method: "POST",
                    byEndpoint: "users",
                    insertData: new User({
                        full_name: usersData.desc,
                        store_name: quickData.domain,
                        print_to_user: userToPrintId
                    }),
                }))
            }
            everyResults.push(...await Promise.all(operations))
        }
    } catch (error) {
        console.error("Error registering users.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}