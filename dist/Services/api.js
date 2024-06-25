"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigApi = void 0;
const axios_1 = __importDefault(require("axios"));
const tokenModelo_1 = require("../models/token/tokenModelo");
class ConfigApi {
    constructor() {
        this.configurarApi();
    }
    async configurarApi() {
        try {
            const aux = new tokenModelo_1.TokenModelo();
            const tokenObj = await aux.buscaToken(); // Obtém o token usando o método buscaToken()
            const url_bling = process.env.BASE_URL;
            const token = tokenObj[0].token; // Obtém o token do objeto retornado
            // Cria a instância do axios com o token
            this.config = axios_1.default.create({
                baseURL: url_bling,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        catch (error) {
            throw new Error(`Erro ao configurar API: ${error.message}`);
        }
    }
}
exports.ConfigApi = ConfigApi;
exports.default = ConfigApi;
