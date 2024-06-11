// Imports
import { getEnvVar } from "./../../config/variables.js";

export async function getTicketData(storeId) {
    try {
        //  Perform request
        const responseTicket = await fetch(`https://api.hubapi.com/crm/v3/objects/tickets/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getEnvVar().HUBSPOT_TOKEN}`
            },
            body: JSON.stringify({
                filterGroups: [{
                    filters: [{
                        propertyName: "id_saipos",
                        operator: "EQ",
                        value: storeId
                    }]
                }],
                properties: [
                    "subject", 
                    "id_saipos", 
                    "n1_2_areas_de_entrega_", 
                    "n2__metodo_de_calculo_para_pizzas_e_", 
                    "nome_das_lojas_no_ifood", 
                    "n1_4_nome_dos_garcons_", 
                    "n1_5_valor_da_diaria_de_garcons_",
                    "n1_3_nome_dos_entregadores_", 
                    "n1_4_diaria_dos_entregadores_", 
                    "site_com_dominio_saipos_",
                    "aceita_retirada_no_balcao", 
                    "cardapio_com_dominio_saipos_", 
                    "instrucoes_de_pagamento",
                    "valor_minimo_de_pedido_", 
                    "quantidade_de_mesas_no_salao_",
                    "ids_do_ifood", 
                    "configuracoes__quicksaipos_", 
                    "pagamento__quicksaipos_", 
                    "usuario_caixa__quicksaipos_",
                    "status_de_venda__quicksaipos_", 
                    "descricao_turno__quicksaipos_", 
                    "horario_turno__quicksaipos_",
                    "taxa_turno__quicksaipos_", 
                    "dias_fim__quicksaipos_", 
                    "horario_de_inicio__quicksaipos_",
                    "horario_de_fim__quicksaipos_", 
                    "quantidade_de_comandas__quicksaipos_", 
                    "dias_inicio__quicksaipos_", 
                    "cardapio___tipo_de_solicitacao",
                    "hs_object_id",
                    "tipo_de_estabelecimento_ticket", 
                    "aceita_entrega__quick_saipos",
                    "aceita_retirada_no_balcao",
                    "saipos_bot__quick_saipos_",
                    "cor_canais_de_venda__quicksaipos_",
                    "login_do_portal_ifood",
                    "senha_do_portal_ifood",
                    "disparo_automatico__quicksaipos_",
                ],
                limit: 1
            })
        })
        const responseTicketData = await responseTicket.json()
        const results = responseTicketData.results[0]?.properties

        // Results handling
        console.log("getTicketData: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("ID Hubspot não encontrado.");
    } catch (error) {
        console.error("Error getting Ticket Data", error)
        throw error
    }
}