"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
require("dotenv/config");
const tokenController_1 = require("./controllers/token/tokenController");
const TokenMiddleware_1 = require("./Middlewares/TokenMiddleware");
const ProdutoController_1 = require("./controllers/produtos/ProdutoController");
const produtoApi_1 = require("./models/produtoApi/produtoApi");
const produtoModelo_1 = require("./models/produto/produtoModelo");
const pedidoController_1 = require("./controllers/pedido/pedidoController");
const apiController_1 = require("./controllers/apiController/apiController");
const config_1 = require("./models/configApi/config");
const getProdutos_1 = require("./controllers/get_vinculo_produtos/getProdutos");
const cron = require('node-cron');
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', TokenMiddleware_1.verificaToken, async (req, res) => {
    res.render('index');
});
router.get('/config', async (req, res) => {
    const configApi = new apiController_1.apiController();
    const objProdutos = new produtoModelo_1.ProdutoModelo();
    const data = await configApi.buscaConfig();
    const tabelas = await objProdutos.buscaTabelaDePreco();
    res.render('config', { 'config': data, 'tabelas': tabelas });
});
router.get('/produtos', TokenMiddleware_1.verificaToken, async (req, res) => {
    const objProdutos = new produtoModelo_1.ProdutoModelo();
    const objSincronizados = new produtoApi_1.ProdutoApi();
    const sincronizados = await objSincronizados.buscaTodos();
    const produtos = await objProdutos.buscaProdutos();
    const tabelas = await objProdutos.buscaTabelaDePreco();
    res.render('produtos', { 'produtos': produtos, 'sincronizados': sincronizados, 'tabelas': tabelas });
});
router.post('/api/produtos', TokenMiddleware_1.verificaToken, new ProdutoController_1.ProdutoController().enviaProduto);
router.get('/callback', async (req, res, next) => {
    const apitokenController = new tokenController_1.TokenController;
    const token = apitokenController.obterToken(req, res, next);
});
router.get('/pedidos', TokenMiddleware_1.verificaToken, new pedidoController_1.pedidoController().buscaPedidosBling);
router.get('/estoque', TokenMiddleware_1.verificaToken, new ProdutoController_1.ProdutoController().enviaEstoque);
router.post('/teste', async (req, res) => {
    const au = JSON.stringify(req.body);
    //console.log(req.body)
    const obj = new config_1.configApi();
    let a = await obj.atualizaDados(req.body);
});
//router.get('/teste2',verificaToken, async (req,res)=>{
//  const aux = new categoriaController();
//  const main = await aux.validaCatedoria(2);
//   console.log(main)
//}) 
router.get('/teste3', TokenMiddleware_1.verificaToken, async (req, res) => {
    const aux = new getProdutos_1.getProdutos();
    await aux.criarVinculo();
});
