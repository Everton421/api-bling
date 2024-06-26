import { conn, db_estoque, db_publico, db_vendas } from "../../database/databaseConfig" ;
import { ProdutoBling } from "../../interfaces/produtoBling";

export class ProdutoModelo{

    async buscaProdutos(){

        return new Promise( async (resolve, reject)=>{
          
            let sql = ` 
                            SELECT * FROM ${db_publico}.cad_prod WHERE NO_SITE = 'S';
                            `;
            await conn.query(sql, (err:any,result:any)=>{
              if(err){
                reject(err);
              }else{
                resolve(result);
              }
            });
        });
  
     }

     async buscaProduto(codigo:number){
      return new Promise( async (resolve, reject)=>{
          let sql = `SELECT * FROM ${db_publico}.cad_prod WHERE NO_SITE = 'S' AND CODIGO = ${codigo};`;

          await conn.query(sql, async (err:any,result:any)=>{
            if(err){
              return reject(err);
            }else{
//              resolve(result);
              resolve(result)
            }
          });
      });
 
   }

  async buscaEstoqueReal(codigo:number ){
    return new Promise( (resolve, reject)=>{
      
                          
    const sqlEstoque=` SELECT *  FROM prod_saldo WHERE CODIGO = ${codigo};`
    conn.query( sqlEstoque ,(err:any , result:any)=>{
      if(err){
        reject(err)
        console.log('erro ao obter o saldo de estoque')
      }else{
          resolve(result);
      }
    })
    })
  }


  async buscaTabelaDePreco( ){
    return new Promise( async (resolve, reject)=>{
      
    const sql=` SELECT * FROM ${db_publico}.tab_precos ORDER BY CODIGO DESC ;
                        `
    await conn.query( sql ,(err:any , result:any)=>{
      if(err){
        reject(err)
        console.log('erro ao obter o tabela de preco')
      }else{
          resolve(result);
      }
    })
    })
  }

async buscaPreco( produto:any, tabela:any ){

  const sql =  ` SELECT pp.PRECO preco from ${db_publico}.prod_tabprecos pp
                join ${db_publico}.tab_precos tp on tp.codigo = pp.tabela 
                 where pp.PRODUTO = ${produto} and tp.CODIGO = ${tabela}   
              ; ` 

  return new Promise( async ( resolve, reject )=>{
    await conn.query(sql, ( err, result )=>{
        if(err){
          reject(err);
        }else{
          resolve(result);
        }
    })
  })
}

async buscaFotos(produto:any){
  const sql =  `  
      SELECT  CAST(FOTO  AS CHAR(1000)  CHARACTER SET utf8)  FOTO  from ${db_publico}.fotos_prod where  PRODUTO = ${produto};    
              ; ` 

  return new Promise( async ( resolve, reject )=>{
    await conn.query(sql, ( err, result )=>{
        if(err){
          reject(err);
        }else{
          resolve(result);
        }
    })
  })

}

  async buscaCaminhoFotos(){
    const sql =  `  
    SELECT  CAST(FOTOS AS CHAR(1000)  CHARACTER SET utf8)  FOTOS from ${db_vendas}.parametros;   
              ; ` 

  return new Promise( async ( resolve, reject )=>{
    await conn.query(sql, ( err, result )=>{
        if(err){
          reject(err);
        }else{
          resolve(result);
        }
    })
  })

}

  

  async buscaNcm( codigo:any){
    return new Promise( async (resolve, reject)=>{
        const sql = `SELECT CODIGO codigo, NCM ncm, COD_CEST cod_cest FROM ${db_publico}.class_fiscal where CODIGO=${codigo};` 
      await conn.query(sql,(err, result)=>{
        if(err){
          reject(err);
        }else{  
          resolve(result);
        }
      })
    })
  }


}
