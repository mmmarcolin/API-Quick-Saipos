import { storeId } from "./../../../config/variables.js"

export class IfoodConfig {
    constructor(data) {
        this.storeId = storeId
        this.status = "opened"
        this.statusMessage = "OK"
        this.featureVersion = "v2"
        this.auth = {
            username: data.username,
            password: data.password
        }
        this.listMessage = [
            {
                "message": "Olá, {nome do cliente}. Gostaríamos de informar que seu pedido foi recebido e já está sendo preparado pela nossa equipe. 🍽️ Agradecemos a preferência e estamos empenhados em proporcionar uma experiência excepcional.",
                "idStoreSaleStatus": data.saleStatusId[0] 
            },
            {
                "message": "Prezado {nome do cliente}, estamos felizes em informar que seu pedido {número do pedido} saiu para entrega. 😍 Em breve estará no endereço solicitado. Bom apetite!",
                "idStoreSaleStatus": 0
            },
            {
                "message": "{nome do cliente}, foi um prazer atender você! 🍷 Esperamos que desfrute da sua refeição tanto quanto nos empenhamos em prepará-la. Se possível, tire um momento para compartilhar sua valiosa opinião no Ifood. Sua satisfação é nossa prioridade. 🌟",
                "idStoreSaleStatus": 0
            },
            {
                "message": "{nome do cliente}, foi um prazer atender você! 🍷 Esperamos que desfrute da sua refeição tanto quanto nos empenhamos em prepará-la. Se possível, tire um momento para compartilhar sua valiosa opinião no Ifood e no Google. Sua satisfação é nossa prioridade. 🌟",
                "idStoreSaleStatus": 0
            },
            {
                "message": "Olá {nome do cliente}! Queremos compartilhar que recebemos o seu pedido e já estamos preparando com muito carinho. 🍽️ Agradecemos pela preferência!",
                "idStoreSaleStatus": 0
            },
            {
                "message": "Agora o aviso é mais legal ainda 🥰 Seu pedido já está a caminho e será entregue em breve. Esperamos que aproveite cada momento e que sua experiência seja deliciosa.",
                "idStoreSaleStatus": data.saleStatusId[1] || 0
            },
            {
                "message": "Olá {nome do cliente}. Esperamos que tenha gostado muito da sua refeição! 🌟 Se puder, nos avalie no Ifood. Sua opinião é muito importante para nós e nos ajuda a melhorar cada vez mais. Obrigado pela confiança!",
                "idStoreSaleStatus": data.saleStatusId[2] 
            }
        ]
    
    }
}