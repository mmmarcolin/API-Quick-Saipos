import { Site } from "./../Classes/Site.js";
import { PartnerEnable } from "./../Classes/PartnerEnable.js";
import { Payment } from "./../Classes/Payment.js";
import { Schedule } from "./../Classes/Schedule.js";
import { fetchSaipos } from "./../requestsToSaipos.js"

export async function partners(quickData) {
    const operations = [];
    const everyResults = [];

    const desiredPayments = [
        "Pix",
        "Dinheiro",
        "Crédito",
        "Débito",
        "Crédito Elo",
        "Crédito Mastercard",
        "Crédito Visa",
        "Crédito American Express",
        "Crédito Hipercard",
        "Débito Elo",
        "Débito Mastercard",
        "Débito Visa",
        "Vale Sodexo",
        "Vale Alelo",
        "Vale Ticket"
    ]
    
    const paymentMappings = {
        "Pix": "pix",
        "Dinheiro": "money",
        "Crédito": "cre",
        "Débito": "deb",
        "Crédito Elo": "creElo",
        "Crédito Mastercard": "creMaster",
        "Crédito Visa": "creVis",
        "Crédito American Express": "creAmex",
        "Crédito Hipercard": "creHiper",
        "Débito Elo": "debElo",
        "Débito Mastercard": "debMaster",
        "Débito Visa": "debVisa",
        "Vale Sodexo": "valSod",
        "Vale Alelo": "valAle",
        "Vale Ticket": "valTic"
    }
    
    const saiposPaymentId = {
        pix: 54,
        money: 9,
        cre: 52,
        deb: 53,
        creElo: 21,
        creMaster: 19,
        creVis: 18,
        creAmex: 15,
        creHiper: 20,
        debElo: 22,
        debMaster: 3,
        debVisa: 5,
        valSod: 129,
        valAle: 122,
        valTic: 125,
    }

    const colorHex = {
        black: "#000000",
        white: "#FFFFFF",
        red: "#FF0000",
        orange: "#FFA500",
        yellow: "#FFFF00",
        green: "#008000",
        blue: "#0000FF",
        purple: "#800080",
        pink: "#FFC0CB",
    }

    const photo = {
        hamburger: [, ],
        pizza: [, ],
        sushi: [, ],
        acai: [, ],
        pastel: [, ],
        pasta: [, ],
        meal: [, ],
        meat: [, ],
        drink: [, ],
        beverage: [, ],
        generic: [, ],
    }

    try {
        const storePaymentId = {}
        await Promise.all(desiredPayments.map(async paymentType => {
            storePaymentId[paymentType] = await fetchSaipos({
                method: "GET",
                byEndpoint: "payment_types",
                findValue: paymentType,
                atKey: "desc_store_payment_type",
                andReturn: "id_store_payment_type"
            })
            everyResults.push(storePaymentId[paymentType])
        }))
        
        const paymentsToPost = new Payment()
        for (const paymentType of desiredPayments) {
            const saiposPaymentKey = paymentMappings[paymentType]
            const paymentId = saiposPaymentKey ? saiposPaymentId[saiposPaymentKey] : null
            const storePaymentType = storePaymentId[paymentType]
            if (!storePaymentType || !paymentId) continue
            
            paymentsToPost.addPayment({
                id_store_payment_type: storePaymentType,
                id_payment_type: paymentId,
            })
        }
        
        const scheduleToPost = new Schedule()
        for (const [day, value] of Object.entries(quickData.weekDays)) {
            if (!value) continue;
            
            const dayIndex = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(day) + 1;
            const nextDayIndex = (dayIndex % 7) + 1;
            const startTime = quickData.startTime;
            const endTime = quickData.endTime;
        
            if (endTime < startTime) {
                scheduleToPost.addWeekDay({
                    day_week: dayIndex,
                    start_time: startTime,
                    end_time: "23:59",
                });
                scheduleToPost.addWeekDay({
                    day_week: nextDayIndex,
                    start_time: "00:00",
                    end_time: endTime,
                });
            } else {
                scheduleToPost.addWeekDay({
                    day_week: dayIndex,
                    start_time: startTime,
                    end_time: endTime,
                });
            }
        }
                
        if (quickData.saiposBot) { 
            everyResults.push(...await Promise.all([
                fetchSaipos({
                    method: "POST",
                    byEndpoint: "use-chatbot",
                    insertData: { use_chatbot: "Y" }
                }),
                fetchSaipos({
                    method: "POST",
                    byEndpoint: "partners_sale/enable_partner_sale",
                    insertData: new PartnerEnable(51)
                })
            ]))
        }
        
        if (quickData.deliverySite) {
            operations.push((async () => {
                const innerOperations = [];
                
                const enableSiteSale = await fetchSaipos({
                    method: "POST",
                    byEndpoint: "partners_sale/enable_partner_sale",
                    insertData: new PartnerEnable(7)
                });
                everyResults.push(enableSiteSale);

                const siteId = await fetchSaipos({
                    method: "GET",
                    byEndpoint: "site_data",
                    andReturn: "id_store_site_data"
                });
                everyResults.push(siteId);

                innerOperations.push(fetchSaipos({
                    method: siteId ? "PUT" : "POST",
                    byEndpoint: `site_data/${siteId || ""}`,
                    insertData: new Site({
                        pickup_counter: quickData.pickupCounter,
                        pickup_delivery: quickData.pickupDelivery,
                        url_site: quickData.domain,
                        minimum_value: quickData.minimumValue,
                        primary_color: colorHex[quickData.color],
                        id_photo_site_cover: photo[quickData.images][0],
                        id_photo_site_background: photo[quickData.images][1]
                    })
                }));

                if (scheduleToPost.upsert.length > 0) {
                    innerOperations.push(fetchSaipos({
                        method: "POST",
                        byEndpoint: "schedules_service/insert-all",
                        insertData: scheduleToPost
                    }));
                }

                if (paymentsToPost.upsert.length > 0) {
                    innerOperations.push(fetchSaipos({
                        method: "POST",
                        byEndpoint: "site-delivery/upsert-payment-types",
                        insertData: paymentsToPost
                    }));
                }

                const siteResults = await Promise.all(innerOperations);
                everyResults.push(...siteResults);
                return siteResults;
            })());
        }
        
        if (quickData.basicMenu || quickData.premiumMenu) {
            operations.push((async () => {
                const innerOperations = [];

                const enableMenuSale = await fetchSaipos({
                    method: "POST",
                    byEndpoint: "partners_sale/enable_partner_sale",
                    insertData: new PartnerEnable(32)
                });
                everyResults.push(enableMenuSale);

                const menuId = await fetchSaipos({
                    method: "GET",
                    byEndpoint: "table_data",
                    andReturn: "id_store_table_data"
                });
                everyResults.push(menuId);

                innerOperations.push(fetchSaipos({
                    byEndpoint: `table_data/${menuId || ""}`,
                    insertData: new Menu({
                        premiumMenu: quickData.premiumMenu,
                        url_site: quickData.domain,
                        primary_color: colorHex[quickData.color],
                        id_photo_site_cover: photo[quickData.images][0]
                    })
                }));

                if (scheduleToPost.upsert.length > 0) {
                    innerOperations.push(fetchSaipos({
                        method: "POST",
                        byEndpoint: "table_data_schedules_service/insert-all",
                        insertData: scheduleToPost
                    }));
                }

                if (paymentsToPost.upsert.length > 0) {
                    innerOperations.push(fetchSaipos({
                        method: "POST",
                        byEndpoint: "digital-table/upsert-payment-types",
                        insertData: paymentsToPost
                    }));
                }

                const results = await Promise.all(innerOperations);
                everyResults.push(...results);
                return results;
            })());
        }
                
        everyResults.push(...await Promise.all(operations))
    } catch (error) {
        console.error("Error registering partners.", error)
    } finally {
        return everyResults.filter(result => result.error)
    }
}