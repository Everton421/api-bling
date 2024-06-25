"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaErp = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class categoriaErp {
    async buscaGrupos() {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.db_publico}.cad_pgru;
             `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaGrupo(grupo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT * FROM ${databaseConfig_1.db_publico}.cad_pgru WHERE CODIGO = ?;
             `;
            await databaseConfig_1.conn.query(sql, [grupo], (err, result) => {
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
exports.categoriaErp = categoriaErp;
