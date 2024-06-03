// Imports
import { normalizeText } from "./../config/variables.js";

// Function to create object response
export async function createObjectResponse(Company, Ticket) {
    // Utility function to check if a string includes a substring
    const includes = (str, substr) => (str ? str.includes(substr) : false);

    // Utility function to replace newlines with commas
    const replaceNewlines = (str) => (str ? str.replace(/\n/g, ",") : "");

    // Return handling
    return {
        paymentTypesPix: includes(Ticket.pagamento__quicksaipos_, "Pix"),
        paymentTypesMaster: includes(Ticket.pagamento__quicksaipos_, "Mastercard"),
        paymentTypesElo: includes(Ticket.pagamento__quicksaipos_, "Elo"),
        paymentTypesVisa: includes(Ticket.pagamento__quicksaipos_, "Visa"),
        paymentTypesAmex: includes(Ticket.pagamento__quicksaipos_, "Amex"),
        paymentTypesHiper: includes(Ticket.pagamento__quicksaipos_, "Hiper"),
        paymentTypesSodexo: includes(Ticket.pagamento__quicksaipos_, "Sodexo"),
        paymentTypesAlelo: includes(Ticket.pagamento__quicksaipos_, "Alelo"),
        configCol42: includes(Ticket.configuracoes__quicksaipos_, "Colunas de impressão: 42"),
        configPermissions: includes(Ticket.configuracoes__quicksaipos_, "Permissões de ADM"),
        configCancelPass: includes(Ticket.configuracoes__quicksaipos_, "Motivo para cancelamento"),
        configCancelReason: includes(Ticket.configuracoes__quicksaipos_, "Senha para cancelamento"),
        configKds: includes(Ticket.configuracoes__quicksaipos_, "KDS"),
        userWaiterApp: includes(Ticket.usuarios__quicksaipos_, "App Garçom"),
        userCashier: includes(Ticket.usuarios__quicksaipos_, "Caixa"),
        saleStatusLeft: Ticket.status_de_venda__quicksaipos_ === "Saiu para entrega",
        saleStatusEasyDelivery: Ticket.status_de_venda__quicksaipos_ === "Entrega fácil",
        deliveryAreaDistrict: Ticket.n1_2_areas_de_entrega_ === "Por Bairro",
        deliveryAreaRadius: Ticket.n1_2_areas_de_entrega_ === "Por Por Raio e Mapa",
        apportionmentProportional: Ticket.n2__metodo_de_calculo_para_pizzas_e_ === "Rateio proporcional",
        apportionmentBigger: Ticket.n2__metodo_de_calculo_para_pizzas_e_ === "Maior Valor",
        partnersSiteDelivery: Ticket.site_com_dominio_saipos_ === "Sim",
        partnersCounterPickup: Ticket.aceita_retirada_no_balcao === "Sim",
        partnersBasicDigitalMenu: Ticket.cardapio___tipo_de_solicitacao === "Cardapio basic",
        partnersPremiumDigitalMenu: Ticket.cardapio___tipo_de_solicitacao === "Cardapio premium",
        partnersInstructionCounter: Ticket.instrucoes_de_pagamento === "Passar no caixa e fazer o pagamento",
        partnersInstructionWaiter: Ticket.instrucoes_de_pagamento === "Aguardar o garçom para fazer o pagamento",
        partnersStartDay: replaceNewlines(Ticket.dias_inicio__quicksaipos_),
        partnersEndDay: replaceNewlines(Ticket.dias_fim__quicksaipos_),
        partnersStartTime: replaceNewlines(Ticket.horario_de_inicio__quicksaipos_),
        partnersEndTime: replaceNewlines(Ticket.horario_de_fim__quicksaipos_),
        partnersMinimumValue: replaceNewlines(Ticket.valor_minimo_de_pedido_),
        shiftDesc: replaceNewlines(Ticket.descricao_turno__quicksaipos_),
        shiftTime: replaceNewlines(Ticket.horario_turno__quicksaipos_),
        shiftServiceFee: replaceNewlines(Ticket.taxa_turno__quicksaipos_),
        waitersQuantity: replaceNewlines(Ticket.n1_4_nome_dos_garcons_),
        waitersDailyRate: replaceNewlines(Ticket.n1_5_valor_da_diaria_de_garcons_),
        deliveryMenQuantity: replaceNewlines(Ticket.n1_3_nome_dos_entregadores_),
        deliveryMenDailyRate: replaceNewlines(Ticket.n1_4_diaria_dos_entregadores_),
        partnersIfoodCode: replaceNewlines(Ticket.ids_do_ifood),
        partnersIfoodName: replaceNewlines(Ticket.nome_das_lojas_no_ifood),
        tableOrders: replaceNewlines(Ticket.quantidade_de_mesas_no_salao_),
        orderCards: replaceNewlines(Ticket.quantidade_de_comandas__quicksaipos_),
        domain: normalizeText(Ticket.subject.slice(8)) || "",
        storeId: replaceNewlines(Ticket.id_saipos),
        storeDataState: Company.estado,
        storeDataCity: Company.city,
        storeDataDistrict: Company.bairro,
        storeDataAddress: Company.address,
        storeDataNumber: Company.endereco_numero,
        storeDataZip: Company.zip,
        storeDataComplement: Company.endereco_complemento,
        storeDataCnpj: Company.cnpj,
        storeDataStateRegistration: Company.inscricao_estadual,
        storeDataCnae: Company.cnae
    };
}
