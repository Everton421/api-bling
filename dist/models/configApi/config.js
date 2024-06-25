"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configApi = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class configApi {
    async atualizaDados(json) {
        let { importar_pedidos, enviar_estoque, enviar_precos, tabela } = json;
        if (!tabela) {
            tabela = 0;
        }
        else {
            tabela = parseInt(tabela);
        }
        if (!importar_pedidos) {
            importar_pedidos = 0;
        }
        else {
            importar_pedidos = parseInt(importar_pedidos);
        }
        if (!enviar_estoque) {
            enviar_estoque = 0;
        }
        else {
            enviar_estoque = parseInt(enviar_estoque);
        }
        if (!enviar_precos) {
            enviar_precos = 0;
        }
        else {
            enviar_precos = parseInt(enviar_precos);
        }
        return new Promise(async (resolve, reject) => {
            const sql = `
                UPDATE ${databaseConfig_1.database_api}.config_bling set  importar_pedidos = ${importar_pedidos} , 
                enviar_estoque =  ${enviar_estoque}  , enviar_precos = ${enviar_precos}, tabela_preco = ${tabela}   where id = 1;
            `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('dados atualizados ');
                    resolve(result);
                }
            });
            //  console.log(sql)
        });
    }
}
exports.configApi = configApi;
