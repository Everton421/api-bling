import express,{NextFunction, Request,Response} from 'express';
import "express-async-errors";
import cors from 'cors';
const https = require('https');
const fs = require('fs');

import { router } from './routes';


        const app = express();

        app.use(express.json());    
        app.use(router)
        app.use(cors)
        app.use(
                (err:Error, req:Request, res:Response, next:NextFunction)=>{
                    if(err instanceof Error){
                        return res.status(400).json({
                            error: err.message,
                        })
                    }
                    res.status(500).json({
                        status:'error ',
                        messsage: 'internal server error.'
                    })
                })
                const PORT = 3000; // Porta padrão para HTTPS
   app.listen(3000,()=>{ console.log('app rodando porta 3000')})
   

