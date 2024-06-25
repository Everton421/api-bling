"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoModelo = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class ProdutoModelo {
    async buscaProdutos() {
        return new Promise(async (resolve, reject) => {
            let sql = ` 
                            SELECT * FROM ${databaseConfig_1.db_publico}.cad_prod WHERE NO_SITE = 'S';
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
    async buscaProduto(codigo) {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT * FROM ${databaseConfig_1.db_publico}.cad_prod WHERE NO_SITE = 'S' AND CODIGO = ${codigo};`;
            await databaseConfig_1.conn.query(sql, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    //              resolve(result);
                    resolve(result);
                }
            });
        });
    }
    async buscaEstoqueReal(codigo) {
        return new Promise((resolve, reject) => {
            const sqlEstoque = ` SELECT *  FROM prod_saldo WHERE CODIGO = ${codigo};`;
            databaseConfig_1.conn.query(sqlEstoque, (err, result) => {
                if (err) {
                    reject(err);
                    console.log('erro ao obter o saldo de estoque');
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaTabelaDePreco() {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT * FROM ${databaseConfig_1.db_publico}.tab_precos ORDER BY CODIGO DESC ;
                        `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                    console.log('erro ao obter o tabela de preco');
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaPreco(produto, tabela) {
        const sql = ` SELECT pp.PRECO preco from ${databaseConfig_1.db_publico}.prod_tabprecos pp
                join ${databaseConfig_1.db_publico}.tab_precos tp on tp.codigo = pp.tabela 
                 where pp.PRODUTO = ${produto} and tp.CODIGO = ${tabela}   
              ; `;
        return new Promise(async (resolve, reject) => {
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
    async buscaFotos(produto) {
        const sql = `  
      SELECT  CAST(FOTO  AS CHAR(1000)  CHARACTER SET utf8)  FOTO  from ${databaseConfig_1.db_publico}.fotos_prod where  PRODUTO = ${produto};    
              ; `;
        return new Promise(async (resolve, reject) => {
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
    async buscaCaminhoFotos() {
        const sql = `  
    SELECT  CAST(FOTOS AS CHAR(1000)  CHARACTER SET utf8)  FOTOS from ${databaseConfig_1.db_vendas}.parametros;   
              ; `;
        return new Promise(async (resolve, reject) => {
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
    async buscaNcm(codigo) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT CODIGO codigo, NCM ncm, COD_CEST cod_cest FROM ${databaseConfig_1.db_publico}.class_fiscal where CODIGO=${codigo};`;
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
}
exports.ProdutoModelo = ProdutoModelo;
