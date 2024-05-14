import { conn_api, database_api } from "../../database/databaseConfig"

export class ProdutoApi{



        async inserir( value:any ){
            const now = new Date(); // Obtém a data e hora atuais

            const dia = String(now.getDate()).padStart(2, '0');
            const mes = String(now.getMonth() + 1).padStart(2, '0');
            const ano = now.getFullYear();
      
            const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
            const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
      
            const dataInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

            return new Promise( async (resolve, reject)=>{
                
                const { id_bling, codigo_sistema } = value;
                const sql = ` INSERT INTO ${database_api}.produtos VALUES ('${id_bling}', '${codigo_sistema}', '${dataInsercao}')` 

                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

        async busca(){
            return new Promise( async ( resolve, reject )=>{
                const sql = ` SELECT * FROM ${database_api}.produtos;`
                await conn_api.query(sql, (err, result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        }

}