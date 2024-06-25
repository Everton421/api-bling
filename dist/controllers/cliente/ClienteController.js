"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteController = void 0;
const api_1 = __importDefault(require("../../Services/api"));
class ClienteController {
    async recebimentoDeCliente() {
        const api = new api_1.default();
        // aguarda a configuração da api 
        await api.configurarApi();
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.config.get('/contatos');
                console.log(response.data);
                resolve(response);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.ClienteController = ClienteController;
