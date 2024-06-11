// Imports
import { normalizeText } from "./../config/variables.js";

// Function to create object response
export async function createObjectResponse(company, ticket, contact) {
    try {
        // Utility function to check if a string includes a substring
        const includes = (str, substr) => (str ? str.includes(substr) : false);

        // Utility function to replace newlines with commas
        const replaceNewlines = (str) => (str ? str.replace(/\n/g, ",") : "");

        // Create response
        const results = {
            paymentTypesPix: includes(ticket.pagamento__quicksaipos_, "Pix"),
            paymentTypesMaster: includes(ticket.pagamento__quicksaipos_, "Mastercard"),
            paymentTypesElo: includes(ticket.pagamento__quicksaipos_, "Elo"),
            paymentTypesVisa: includes(ticket.pagamento__quicksaipos_, "Visa"),
            paymentTypesAmex: includes(ticket.pagamento__quicksaipos_, "Amex"),
            paymentTypesHiper: includes(ticket.pagamento__quicksaipos_, "Hiper"),
            paymentTypesSodexo: includes(ticket.pagamento__quicksaipos_, "Sodexo"),
            paymentTypesAlelo: includes(ticket.pagamento__quicksaipos_, "Alelo"),
            paymentTypesTicket: includes(ticket.pagamento__quicksaipos_, "Ticket"),
            settingsCancelPassword: includes(ticket.configuracoes__quicksaipos_, "Senha para cancelamento"),
            settingsCancelReason: includes(ticket.configuracoes__quicksaipos_, "Motivo para cancelamento"),
            settingsKds: includes(ticket.configuracoes__quicksaipos_, "KDS"),
            waiterCashier: ticket.usuario_caixa__quicksaipos_ === "true",
            saleStatusDelivery: ticket.status_de_venda__quicksaipos_ === "Saiu para entrega",
            saleStatusEasyDelivery: ticket.status_de_venda__quicksaipos_ === "Entrega fácil",
            deliveryAreaType: ticket.n1_2_areas_de_entrega_ === "Por Bairro"
                ? "districts"
                : "area",
            apportionmentMethod: ticket.n2__metodo_de_calculo_para_pizzas_e_ === "Maior Valor" 
                ? "apportionment-bigger"
                : "apportionment-proportional",
            partners: ticket.site_com_dominio_saipos_ === "Sim" 
                ? ticket.cardapio___tipo_de_solicitacao === "Cardapio basic" 
                    ? "delivery-site, basic-menu"
                    : ticket.cardapio___tipo_de_solicitacao === "Cardapio Premium"
                        ? "delivery-site, premium-menu"
                        : "delivery-site"
                : ticket.cardapio___tipo_de_solicitacao === "Cardapio basic" 
                    ? "basic-menu"
                    : ticket.cardapio___tipo_de_solicitacao === "Cardapio Premium"
                        ? "premium-menu"
                        : "",
            partnersPickupMethod: ticket.aceita_entrega__quicksaipos_ 
                ? ticket.aceita_retirada_no_balcao 
                    ? "delivery, counter" 
                    : "delivery" 
                : ticket.aceita_retirada_no_balcao 
                    ? "counter" 
                    : "",
            partnersSaiposBot: ticket.saipos_bot__quick_saipos_ === "true",
            partnersStartDay: replaceNewlines(ticket.dias_inicio__quicksaipos_),
            partnersEndDay: replaceNewlines(ticket.dias_fim__quicksaipos_),
            partnersStartTime: replaceNewlines(ticket.horario_de_inicio__quicksaipos_),
            partnersEndTime: replaceNewlines(ticket.horario_de_fim__quicksaipos_),
            partnersMinimumValue: replaceNewlines(ticket.valor_minimo_de_pedido_),
            partnersColors: ticket.cor_canais_de_venda__quicksaipos_ || "",
            shiftDesc: replaceNewlines(ticket.descricao_turno__quicksaipos_),
            shiftTime: replaceNewlines(ticket.horario_turno__quicksaipos_),
            shiftServiceFee: replaceNewlines(ticket.taxa_turno__quicksaipos_),
            waitersQuantity: replaceNewlines(ticket.n1_4_nome_dos_garcons_),
            waitersDailyRate: replaceNewlines(ticket.n1_5_valor_da_diaria_de_garcons_),
            deliveryMenQuantity: replaceNewlines(ticket.n1_3_nome_dos_entregadores_),
            deliveryMenDailyRate: replaceNewlines(ticket.n1_4_diaria_dos_entregadores_),
            ifoodCode: replaceNewlines(ticket.ids_do_ifood),
            ifoodName: replaceNewlines(ticket.nome_das_lojas_no_ifood),
            ifoodUsername: ticket.login_do_portal_ifood || "",
            ifoodPassword: ticket.senha_do_portal_ifood || "",
            ifoodAutoSending: ticket.disparo_automatico__quicksaipos_ === "true",
            orderTables: replaceNewlines(ticket.quantidade_de_mesas_no_salao_),
            orderCards: replaceNewlines(ticket.quantidade_de_comandas__quicksaipos_),
            domain: normalizeText(ticket.subject.slice(8)) || "",
            storeId: replaceNewlines(ticket.id_saipos),
            storeDataState: company.estado,
            storeDataCity: company.city,
            storeDataDistrict: company.bairro,
            storeDataAddress: company.address,
            storeDataNumber: company.endereco_numero,
            storeDataZip: company.zip,
            storeDataComplement: company.endereco_complemento,
            storeDataCnpj: company.cnpj,
            storeDataStateRegistration: company.inscricao_estadual,
            storeDataCnae: company.cnae,
            storeDataPhone: contact.phone,
        };

        results.partnersImages = (() => {
            switch (ticket.tipo_de_estabelecimento_ticket) {
                case "Açaí":
                    return "acai"
                case "Bar":
                    return "drink"
                case "Buffet por Kilo":
                    return "meal"
                case "Cafeteria":
                    return "pastel"
                case "Confeitaria/Doceria/Padaria":
                    return "pastel"
                case "Fast Food":
                    return "hamburger"
                case "Lanchonete":
                    return "hamburger"
                case "Marmitex":
                    return "meal"
                case "Pizzaria":
                    return "pizza"
                case "Restaurante":
                    return "meal"
                case "Sushi":
                    return "sushi"
                default:
                    return "generic"
            }
        })();
        
        // Results handling
        console.log("createObjectResponse: " + JSON.stringify(results));
        if (results) return results;
        throw new Error("Error creating object response");
    } catch (error) {
        throw error
    }
}
