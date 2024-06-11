export async function createFinalReport(data, moduleResults) {
    try {
        // Translate modules
        const moduleNamesInPortuguese = {
            ifoodIntegration: "Integração Ifood",
            paymentTypes: "Formas de pagamento",
            storeData: "Dados da loja",
            choices: "Adicionais",
            settings: "Configurações",
            saleStatus: "Status de venda",
            orderTable: "Mesas",
            orderCard: "Comandas",
            shifts: "Turnos",
            waiters: "Garçons",
            deliveryMen: "Entregadores",
            users: "Usuários",
            deliveryAreas: "Áreas de entrega",
            menu: "Cardápio",
            partners: "Canais de venda"
        };

        // Initialize the report sections
        let results = [`CADASTRO CONCLUÍDO: ${data.generalData.storeId} | ${data.generalData.time.delta} segundos`, ""];

        // Classify each module result into categories
        let executedSuccessfully = [];
        let possibleFailures = [];
        let notExecuted = [];

        // Fill each array
        for (let [module, value] of Object.entries(moduleResults)) {
            const moduleNameInPortuguese = moduleNamesInPortuguese[module] || module;  // Fallback to the original name if not found

            switch (value) {
                case "SUCESSO":
                    executedSuccessfully.push(`• ${moduleNameInPortuguese}`);
                    break;
                case "NÃO EXECUTADO":
                    notExecuted.push(`• ${moduleNameInPortuguese}`);
                    break;
                case "POSSÍVEL FALHA":
                    possibleFailures.push(`• ${moduleNameInPortuguese}`);
                    break;
                default:
                    break;
            }
        }

        // Append categorized results to the report
        if (executedSuccessfully.length > 0)
            results.push("EXECUTADOS COM SUCESSO ✅", ...executedSuccessfully, "");
        if (possibleFailures.length > 0)
            results.push("POSSÍVEIS FALHAS ⚠️", ...possibleFailures, "");
        if (notExecuted.length > 0)
            results.push("NÃO EXECUTADOS ➖", ...notExecuted, "");

        // Results handling
        console.log("createFinalReport: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("Error creating final report");
    } catch (error) {
        console.error("Error creating final report", error);
        throw error;
    }
}