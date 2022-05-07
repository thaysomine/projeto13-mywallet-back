import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';

const app = express();
app.use(express.json()); 
app.use(cors());

// conectando ao banco de dados
let database = null;
dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();
promise.then(()=> {
    database = mongoClient.db('usersDataBase');
    console.log('Conectado ao banco de dados');
});
promise.catch((err) => console.log(err));

// post para cadastrar um novo usuário
app.post('/sign-up', async (req, res) => {
    const body = req.body;
    console.log('body do cadastro', body);
    const user = {
        name: body.name,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    };

    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required().valid(joi.ref('password'))
    });
    const validation = schema.validate(user);
    if(validation.error){
        console.log('Erro ao cadastrar usuário', validation.error);
        res.status(422).send('Erro ao cadastrar usuario');
        return;
    }

    try {
        const checkName = await database.collection('users').findOne({name: body.name});
        if (checkName) {
            res.status(409).send('User já cadastrado');
            console.log('User já cadastrado');
            return;
        }

        await database.collection('users').insertOne(user);
        console.log('user cadastrado', user);
        res.sendStatus(201);
    } catch {
        res.status(422).send("Erro ao cadastrar");
    }
});

app.listen(5000);

