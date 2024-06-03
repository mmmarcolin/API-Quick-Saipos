import { PartnerEnable } from "./../Classes/PartnerEnable.js";
import { IfoodVerify } from "./../Classes/IfoodVerify.js";
import { Ifood } from "./../Classes/Ifood.js";
import { fetchSaipos } from "./../requestsToSaipos.js";

export async function ifoodIntegration(quickData) {
    const operations = [];
    const everyResults = [];

    try {
        const enableIntegrationResult = await fetchSaipos({
            method: "POST",
            byEndpoint: "partners_sale/enable_partner_sale",
            insertData: new PartnerEnable(1)
        });
        everyResults.push(enableIntegrationResult);

        for (const integration of quickData) {
            operations.push((async () => {
                const verifyRes = await fetchSaipos({
                        method: "POST",
                        byEndpoint: "partners_sale/verify_partner_sale_api_login",
                    insertData: new IfoodVerify({
                        _cod_store: integration.code,
                        _desc_store_partner: integration.name,
                    })
                });
                everyResults.push(verifyRes);

                if (verifyRes.access_token === "SUCCESS") {
                    return fetchSaipos({
                        method: "POST",
                        byEndpoint: "partners_sale",
                        insertData: new Ifood({
                            _cod_store: integration.code,
                            _desc_store_partner: integration.name,
                        })
                    });
                } else {
                    const message = "Verificação de integração Ifood falhou."
                    return { error: true, response: message };
                }
            })());
        }

        everyResults.push(...await Promise.all(operations));
    } catch (error) {
        console.error("Error registering ifood integration.", error);
    } finally {
        return everyResults.filter(result => result.error);
    }
}
