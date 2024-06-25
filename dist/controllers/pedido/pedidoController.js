"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoController = void 0;
const api_1 = __importDefault(require("../../Services/api"));
const clienteErp_1 = require("../../models/cliente/clienteErp");
const clienteApi_1 = require("../../models/clienteApi/clienteApi");
const pedidoModelo_1 = require("../../models/pedido/pedidoModelo");
const pedidoApi_1 = require("../../models/pedidoApi/pedidoApi");
class pedidoController {
    async buscaPedidosBling() {
        function funcaoData() {
            const now = new Date(); // Obtém a data e hora atuais
            const dia = String(now.getDate()).padStart(2, '0');
            const mes = String(now.getMonth() + 1).padStart(2, '0');
            const ano = now.getFullYear();
            const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const dataHoraInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
            const dataInsercao = `${ano}-${mes}-${dia}`;
            const horaInsercao = `${hora}:${minuto}:${segundo}`;
            return { dataHoraInsercao, dataInsercao, horaInsercao };
        }
        const api = new api_1.default();
        const clientERP = new clienteErp_1.ClienteErp();
        const clientApi = new clienteApi_1.clienteApi();
        const pedidoApi = new pedidoApi_1.PedidoApi();
        const objPedidoErp = new pedidoModelo_1.pedidoErp();
        await api.configurarApi();
        let dadosPedidos;
        let pagina = 1;
        let continuar = true;
        let arr = [];
        while (continuar) {
            try {
                const response = await api.config.get(`/pedidos/vendas`, {
                    params: {
                        pagina: pagina,
                        situacao: 2
                    }
                });
                let arrPedidos = response.data.data;
                if (arrPedidos.length > 0) {
                    arr = arr.concat(arrPedidos);
                    ;
                    pagina++;
                }
                else {
                    continuar = false;
                }
            }
            catch (err) {
                console.log("erro ao buscar pedidos " + err);
                continuar = false;
            }
        }
        ///  console.log(arr)
        for (const data of arr) {
            let clientPedidoBling = data.contato.id;
            let cpfClientBling = data.contato.numeroDocumento;
            let clientvalidacao = [];
            let idPedidoBling = data.id;
            //       inicio validação do cliente 
            try {
                clientvalidacao = await clientERP.buscaPorCnpj(cpfClientBling);
            }
            catch (err) {
                console.log("erro ao validar  cliente");
            }
            let dadosClientBling;
            let dadosClientErp;
            if (clientvalidacao.length > 0) {
                dadosClientErp = clientvalidacao[0].CODIGO;
            }
            else {
                try {
                    dadosClientBling = await api.config.get(`/contatos/${clientPedidoBling}`);
                    try {
                        const resposta = dadosClientBling.data.data;
                        console.log('cadastrando cnpj: ', cpfClientBling);
                        try {
                            const clientCadastradoErp = await clientERP.cadastrarClientErp(resposta);
                            dadosClientErp = clientCadastradoErp.insertId;
                            if (dadosClientErp > 0) {
                                const dadosCadastroClientApi = { clientPedidoBling, dadosClientErp, cpfClientBling };
                                try {
                                    const respostaClienteApi = await clientApi.cadastrarClientApi(dadosCadastroClientApi);
                                    //console.log(respostaClienteApi)
                                }
                                catch (err) {
                                    console.log("erro ao inserir clienteApi " + err);
                                }
                            }
                        }
                        catch (err) {
                            console.log('erro ao cadastrar o cliente');
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            //fim da validação do cliente 
            let pedidoResponse;
            try {
                const reponse = await api.config.get(`/pedidos/vendas/${idPedidoBling}`);
                pedidoResponse = reponse.data.data;
                // console.log(pedidoResponse)
            }
            catch (err) {
                console.log(err, 'erro ao buscar pedido no bling ');
            }
            let idPedidoResponse = pedidoResponse.id;
            let totalProdutos = pedidoResponse.totalProdutos;
            let total = pedidoResponse.total;
            let dataPedidoResponse = pedidoResponse.data;
            let pedidoCadastrado;
            let qtdParcelas = pedidoResponse.parcelas.length;
            let outrasDespesas = pedidoResponse.outrasDespesas;
            let itensPedido = pedidoResponse.itens;
            let codigPedidoCadastrado;
            let desconto = pedidoResponse.desconto.valor;
            let valorFrete = pedidoResponse.transporte.frete;
            let parcelasPedido = pedidoResponse.parcelas;
            try {
                const response = await pedidoApi.validaPedido(idPedidoResponse);
                if (response.length > 0) {
                    //console.log(response[0]);
                    pedidoCadastrado = true;
                    codigPedidoCadastrado = response[0].codigo_sistema;
                }
                else {
                    pedidoCadastrado = false;
                }
            }
            catch (err) {
                console.log(err);
            }
            const data_cadastro = funcaoData().dataInsercao;
            const hora_cadastro = funcaoData().horaInsercao;
            if (pedidoCadastrado === false) {
                const data = {
                    codigo_site: idPedidoResponse,
                    status: 0,
                    cliente: dadosClientErp,
                    total_produtos: totalProdutos,
                    desc_prod: desconto,
                    total_geral: total,
                    data_pedido: dataPedidoResponse,
                    valor_frete: valorFrete,
                    situacao: 'EA',
                    data_cadastro: data_cadastro,
                    hora_cadastro: hora_cadastro,
                    data_inicio: data_cadastro,
                    hora_inicio: hora_cadastro,
                    vendedor: 1,
                    contato: '',
                    observacoes: '',
                    observacoes2: '',
                    tipo: 1,
                    NF_ENT_OS: '',
                    RECEPTOR: '',
                    VAL_PROD_MANIP: total,
                    PERC_PROD_MANIP: 0,
                    PERC_SERV_MANIP: 100,
                    REVISAO_COMPLETA: 'N',
                    DESTACAR: 'N',
                    TABELA: 'P',
                    QTDE_PARCELAS: qtdParcelas,
                    ALIQ_ISSQN: 0,
                    OUTRAS_DESPESAS: outrasDespesas,
                    PESO_LIQUIDO: 0,
                    BASE_ICMS_UF_DEST: 0,
                    FORMA_PAGAMENTO: 0,
                    produtos: itensPedido,
                    parcelas: parcelasPedido
                };
                let codigoPedidoErp;
                try {
                    const result = await objPedidoErp.cadastrarPedido(data);
                    codigoPedidoErp = result.insertId;
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                // return res.json({'msg':"pedido ja cadastrado"})
                console.log({ 'msg': `pedido ja cadastrado  id-bling: ${idPedidoBling} id-intersig: ${codigPedidoCadastrado}` });
                continue;
            }
        }
    }
    async buscaPedidosErp() {
    }
}
exports.pedidoController = pedidoController;
