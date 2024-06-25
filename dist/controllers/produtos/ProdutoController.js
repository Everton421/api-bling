"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const produtoModelo_1 = require("../../models/produto/produtoModelo");
const api_1 = __importDefault(require("../../Services/api"));
const produtoApi_1 = require("../../models/produtoApi/produtoApi");
const imgController_1 = require("../imgBB/imgController");
const categoriaController_1 = require("../categoria/categoriaController");
const TokenMiddleware_1 = require("../../Middlewares/TokenMiddleware");
// import { api } from "../../Services/api";
class ProdutoController {
    async enviaProduto(req, res) {
        const categoriacontroller = new categoriaController_1.categoriaController();
        const produtoSelecionado = req.body.produto;
        const tabelaSelecionada = req.body.tabela;
        const api = new api_1.default();
        const produto = new produtoModelo_1.ProdutoModelo();
        const produtoApi = new produtoApi_1.ProdutoApi();
        const fotosController = new imgController_1.imgController();
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function envio() {
            let produtos = [];
            if (produtoSelecionado === '*') {
                produtos = await produto.buscaProdutos();
                console.log(produtoSelecionado);
            }
            else {
                produtos = await produto.buscaProduto(produtoSelecionado);
            }
            for (const data of produtos) {
                // console.log(data);
                //envio de imagen
                let links = await fotosController.postFoto(data);
                //
                //valida grupo
                let categoria = await categoriacontroller.validaCatedoria(data.GRUPO);
                const produtoSincronizado = await produtoApi.busca(data.CODIGO);
                let preco = 0;
                try {
                    const result = await produto.buscaPreco(data.CODIGO, tabelaSelecionada);
                    if (result[0].preco !== undefined || result[0].preco !== null) {
                        preco = result[0].preco;
                        //console.log(preco)
                    }
                }
                catch (err) {
                    console.log("erro ao obter tabela de preco para o produto: " + data.CODIGO);
                }
                //busca ncm
                let queryNcm = [];
                try {
                    queryNcm = await produto.buscaNcm(data.CLASS_FISCAL);
                }
                catch (err) {
                    console.log('erro ao obter o ncm do produto');
                }
                let ncm;
                let cod_cest;
                if (queryNcm.length > 0) {
                    ncm = queryNcm[0].ncm;
                    cod_cest = queryNcm[0].cod_cest;
                }
                else {
                    ncm = null;
                    cod_cest = null;
                }
                if (queryNcm[0].cod_cest === '00.000.00') {
                    cod_cest = null;
                }
                const post = {
                    codigo: data.CODIGO,
                    nome: data.DESCRICAO,
                    descricaoCurta: data.DESCR_CURTA_SITE,
                    descricaoComplementar: data.DESCR_LONGA_SITE,
                    tipo: 'P',
                    unidade: 'un',
                    preco: preco,
                    pesoBruto: 1,
                    formato: 'S',
                    largura: data.LARGURA,
                    altura: data.ALTURA,
                    profundidade: data.COMPRIMENTO,
                    dimensoes: { altura: data.ALTURA, largura: data.LARGURA, profundidade: data.COMPRIMENTO },
                    tributacao: { cest: cod_cest, ncm: ncm, },
                    midia: {
                        "imagens": {
                            "externas": links
                        }
                    },
                    categoria: {
                        id: categoria
                    }
                };
                console.log(post);
                //atualiza caso ja tenha sido enviado 
                if (produtoSincronizado.length > 0) {
                    //return console.log('produto ja foi enviado ')
                    const id = produtoSincronizado[0].Id_bling;
                    const put = {
                        id: id,
                        codigo: data.CODIGO,
                        nome: data.DESCRICAO,
                        descricaoCurta: data.DESCR_CURTA,
                        descricaoComplementar: data.DESCR_LONGA,
                        tipo: 'P',
                        unidade: 'un',
                        preco: preco,
                        pesoBruto: 1,
                        formato: 'S',
                        largura: data.LARGURA,
                        altura: data.ALTURA,
                        profundidade: data.COMPRIMENTO,
                        dimensoes: { altura: data.ALTURA, largura: data.LARGURA, profundidade: data.COMPRIMENTO },
                        tributacao: { cest: cod_cest, ncm: ncm, },
                        midia: {
                            "imagens": {
                                "externas": links
                            }
                        },
                        categoria: {
                            id: categoria
                        }
                    };
                    try {
                        const response = await api.config.put(`/produtos/${id}`, put);
                        console.log(response.status, "atualizado com sucesso!");
                        console.log(response);
                    }
                    catch (err) { }
                }
                else {
                    try {
                        const response = await api.config.post('/produtos', post);
                        //console.log(post);
                        const produtoEnviado = {
                            id_bling: response.data.data.id,
                            codigo_sistema: data.CODIGO,
                            descricao: data.DESCRICAO
                        };
                        try {
                            let prod = await produtoApi.inserir(produtoEnviado);
                        }
                        catch (error) {
                            console.log("erro ao cadastrar no banco da api " + error);
                        }
                        if (response.status === 200 || response.status === 201 && produtoSelecionado !== '*') {
                            //return console.log( "produto enviado com sucesso");
                            return res.json({ "msg": "produto enviado com sucesso!" });
                        }
                    }
                    catch (error) {
                        if (error.response) {
                            console.log('Status:', error.response.data);
                            const v = error.response.data.error.fields[0].msg;
                            if (produtoSelecionado !== '*') {
                                return res.json({ "msg": v });
                            }
                            //return console.log(v) ;
                        }
                    }
                }
                await delay(3000);
            }
            return;
        }
        try {
            envio();
        }
        catch (err) {
            console.log(err);
        }
    }
    async enviaEstoque() {
        await (0, TokenMiddleware_1.verificaTokenTarefas)();
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const api = new api_1.default();
        const produtoApi = new produtoApi_1.ProdutoApi();
        const produto = new produtoModelo_1.ProdutoModelo();
        try {
            await api.configurarApi(); // Aguarda a configuração da API
            const deposito = await api.config.get('/depositos');
            const idDeposito = deposito.data.data[0].id;
            const produtosEnviados = await produtoApi.buscaTodos();
            for (const data of produtosEnviados) {
                const resultSaldo = await produto.buscaEstoqueReal(data.codigo_sistema);
                let saldoReal;
                if (resultSaldo.length > 0) {
                    saldoReal = resultSaldo[0].ESTOQUE;
                }
                else {
                    saldoReal = 0;
                }
                let estoque = {
                    "produto": {
                        "id": data.Id_bling
                    },
                    "deposito": {
                        "id": idDeposito
                    },
                    "operacao": "B",
                    "preco": 0,
                    "custo": 0,
                    "quantidade": saldoReal,
                    "observacoes": ""
                };
                try {
                    let status;
                    let estoqueEnviado;
                    estoqueEnviado = await api.config.post('/estoques', estoque);
                    status = estoqueEnviado.status;
                    //  console.log(estoqueEnviado.data);
                    if (status !== 201) {
                        await delay(3000);
                        console.log(`erro ao enviar saldo tentando enviar novamente ${status} `);
                        estoqueEnviado = await api.config.post('/estoques', estoque);
                        console.log(estoqueEnviado.data);
                    }
                    console.log(estoqueEnviado.data);
                    console.log(` enviado saldo para produto: ${data.codigo_sistema}   saldo: ${saldoReal}  idBling: ${data.Id_bling} `);
                }
                catch (err) {
                    console.log(estoque);
                    console.log(err + ` erro ao enviar o estoque para o produto ${data.codigo_sistema} `);
                }
                await delay(1000);
            }
            console.log('fim do processo');
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.ProdutoController = ProdutoController;
