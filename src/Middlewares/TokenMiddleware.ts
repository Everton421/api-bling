import { Request, Response, NextFunction } from "express";
import { conn_api, database_api } from "../database/databaseConfig";
import axios from "axios";
import { TokenController } from "../controllers/token/tokenController";
import { TokenModelo } from "../models/token/tokenModelo";


export async function verificaToken(req: Request, res: Response, next: NextFunction) {
                        
               const client_id = process.env.CLIENT_ID;
               const client_secret = process.env.CLIENT_SECRET;
               const urlAuthorize = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&state=f0a329cc3a9c94fa12f00186e09be104`
              
              
               const url_bling:any = process.env.BASE_URL
                
              const objToken = new TokenModelo();

    const tokenBD:any = await objToken.buscaToken(); // token registrado no banco 

            if (!tokenBD[0] || tokenBD[0] === undefined ) { // Se não houver token registrado, redireciona para a rota de autorizaçao 
                res.redirect(urlAuthorize)
            } else {
                
                const verificacao = objToken.verificaExpiracao(tokenBD[0]);
                    if( verificacao === false){
                        const refreshToken = tokenBD[0].refresh_token;
                            
                        //se nao existir refresh token redireciona para autorização do aplicativo
                        if(!refreshToken || refreshToken === undefined ){
                                 return   res.redirect(urlAuthorize)
                                }else{
                                        const base64Credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
                                            const headers = {
                                                'Host': 'www.bling.com.br',
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Accept': '1.0',
                                                'Authorization': `Basic ${base64Credentials}`
                                            }

                                            const data = new URLSearchParams();
                                            data.append('grant_type', 'refresh_token');
                                            data.append('refresh_token', refreshToken);

                                            try {
                                                const responseToken = await axios.post(url_bling+data, { headers })
                                
                                                if (responseToken.status === 200) {
                                                    objToken.insereToken(responseToken.data, database_api);
                                                    next();
                                                }

                                            } catch (err) {
                                                res.redirect(urlAuthorize)
                                            
                                            }
                                    }
                    }else{
                        next();
                    }

            }


}
