"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaApi = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class categoriaApi {
    data() {
        const now = new Date(); // Obtém a data e hora atuais
        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const dataHoraInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
        const dataInsercao = `${ano}-${mes}-${dia}`;
        return { dataHoraInsercao, dataInsercao };
    }
    formatDescricao(descricao) {
        return descricao.replace(/'/g, '');
    }
    async buscaCategoriaApi(codigo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.database_api}.categorias WHERE codigo_sistema = ? ;
             `;
            await databaseConfig_1.conn_api.query(sql, [codigo], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async cadastraCategoriaApi(value) {
        return new Promise(async (resolve, reject) => {
            let dataInsercao = this.data().dataInsercao;
            const { id_bling, codigo_sistema, descricao } = value;
            let descricaoSemAspas = this.formatDescricao(descricao);
            const sql = ` INSERT INTO ${databaseConfig_1.database_api}.categorias VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}')`;
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
exports.categoriaApi = categoriaApi;
