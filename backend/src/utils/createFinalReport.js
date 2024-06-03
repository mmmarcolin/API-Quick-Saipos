// Function to create register final report
export function createFinalReport(data, results) {
    try {
        // Translate modules
        const moduleNamesInPortuguese = {
            ifoodIntegration: "Integração Ifood",
            paymentTypes: "Formas de pagamento",
            storeData: "Dados da loja",
            choices: "Adicionais",
            settings: "Configurações",
            saleStatus: "Status de venda",
            tableOrder: "Mesas",
            orderCard: "Comandas",
            shifts: "Turnos",
            waiters: "Garçons",
            deliveryMen: "Entregadores",
            users: "Usuários",
            deliveryAreas: "Áreas de entrega",
            menu: "Cardápio",
            partners: "Canais de venda"
        }
        
        // Create and return report
        let report = `FIM: ${data.generalData.storeId} | ${data.generalData.time.timestamp} segundos\n\nMÓDULOS CADASTRADOS:\n`
        for (let [module, success] of Object.entries(results)) {
            if (success) { 
                const moduleNameInPortuguese = moduleNamesInPortuguese[module] || module
                report += `${moduleNameInPortuguese}\n`
            }
        }

        // Results handling
        console.log("createFinalReport: " + JSON.stringify(report));
        if (report) return report;
        throw new Error("Error creating final report");
    } catch (error) {
        console.error("Error posting to Google Sheets", error)
        throw error
    }
}