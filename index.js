import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import accountRouter from './routes/accountRouter.js';
import authRouter from './routes/authRouter.js';

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());
dotenv.config();

// cadastro, login e logout
app.use(authRouter);
// get e post para enviar e receber informações da conta do usuário
app.use(accountRouter);

app.listen(process.env.PORT);

