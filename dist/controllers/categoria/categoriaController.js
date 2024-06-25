"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaController = void 0;
const api_1 = __importDefault(require("../../Services/api"));
const categoriaApi_1 = require("../../models/categoriaApi/categoriaApi");
const categoriaErp_1 = require("../../models/categoriaErp/categoriaErp");
class categoriaController {
    async validaCatedoria(value) {
        const api = new api_1.default();
        const categoriaSistema = new categoriaErp_1.categoriaErp();
        const categoriaAPI = new categoriaApi_1.categoriaApi();
        let categoria = [];
        categoria = await categoriaAPI.buscaCategoriaApi(value);
        let id_bling = null;
        let codigo_sistema = null;
        let descricao = null;
        if (categoria.length > 0) {
            console.log('categoria ja esta cadastrada');
            id_bling = categoria[0].Id_bling;
        }
        else {
            const cadastroSistema = await categoriaSistema.buscaGrupo(value);
            // console.log(cadastroSistema)
            if (cadastroSistema.length > 0) {
                await api.configurarApi(); // Aguarda a configuração da API
                codigo_sistema = cadastroSistema[0].CODIGO;
                descricao = cadastroSistema[0].NOME;
                const data = {
                    "descricao": descricao,
                    "categoriaPai": {
                        "id": 0
                    }
                };
                //    console.log(data);
                try {
                    const responseBling = await api.config.post('/categorias/produtos', data);
                    // console.log(responseBling.data.data)
                    id_bling = responseBling.data.data.id;
                    //   console.log(id_bling)
                    const value = { id_bling, codigo_sistema, descricao };
                    const cadastro = await categoriaAPI.cadastraCategoriaApi(value);
                }
                catch (err) {
                    console.log('erro ao enviar categoria ' + err);
                }
            }
        }
        return id_bling;
    }
}
exports.categoriaController = categoriaController;
