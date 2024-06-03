import ConfigApi from "../../Services/api";
import { conn_api, database_api } from "../../database/databaseConfig";
import { ProdutoApi } from "../../models/produtoApi/produtoApi";

export class getProdutos{

     delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatDescricao(descricao: string): string {
        return descricao.replace(/'/g, '');
        }

    async criarVinculo(){


        const now = new Date(); // Obtém a data e hora atuais

        const dia = String(now.getDate()).padStart(2, '0');
        const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
  
        const hora = String(now.getHours()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const minuto = String(now.getMinutes()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
        const segundo = String(now.getSeconds()).padStart(2, '0'); // Adiciona um zero à esquerda se for menor que 10
  
        const dataInsercao = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

        const produto = new  ProdutoApi();
        const  api:any = new ConfigApi();
        
        let produtos:any=[];
        await api.configurarApi(); // Aguarda a configuração da API
        
        try{
         
              const response  = await api.config.get(`/produtos`)
                produtos = response.data.data;
              //console.log(produtos.data.data);
        }catch(err){
            console.log("erro ao buscar produtos "+err)
        }


          for(let prod of produtos ){  
  
          const    id_bling = prod.id   
          const  codigo_sistema = parseInt(prod.codigo); 
          const     descricao  = prod.nome
  
              const value = {
                  id_bling,codigo_sistema, descricao
              }

               console.log(value)
            
              await this.delay(2000);

 
                 let descricaoSemAspas = this.formatDescricao(descricao);
                 
 
                 const sql = ` INSERT INTO ${database_api}.produtos_get VALUES ('${id_bling}','${descricaoSemAspas}','${codigo_sistema}', '${dataInsercao}')` 
 
                 await conn_api.query(sql, (err:any, result)=>{
                     if(err){
             console.log(err);
                     }else{
                       console.log(result)
                     }
                 })

  
      }

    }

}