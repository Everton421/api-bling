"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoApi = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class ProdutoApi {
    formatDescricao(descricao) {
        return descricao.replace(/'/g, '');
    }
    async inserir(value) {
        const now = new Date(); // Obtém a data e hora atuais
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const dataInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
        return new Promise(async (resolve, reject) => {
            const { id_bling, codigo_sistema, descricao } = value;
            let descricaoSemAspas = this.formatDescricao(descricao);
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.produtos VALUES
                 ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}') ON  DUPLICATE
                 KEY UPDATE descricao ='${descricaoSemAspas}' , codigo_sistema ='${codigo_sistema}' 
                 `;
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaTodos() {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.produtos;`;
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async busca(produto) {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.database_api}.produtos WHERE  codigo_sistema = ${produto} ;`;
            await databaseConfig_1.conn_api.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.ProdutoApi = ProdutoApi;
