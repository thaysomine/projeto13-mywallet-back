import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';

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
        email: joi.string().required().pattern(/\S+@\S+\.\S+/),
        password: joi.string().required().pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
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
        const checkEmail = await database.collection('users').findOne({email: body.email});
        if (checkName) {
            res.status(409).send('User já cadastrado');
            console.log('User já cadastrado');
            return;
        }
        if (checkEmail) {
            res.status(409).send('Email já cadastrado');
            console.log('Email já cadastrado');
            return;
        }
        
        const hash = await bcrypt.hash(body.password, 10);
        await database.collection('users').insertOne({name: body.name, email: body.email, password: hash});
        console.log('user cadastrado', {name: body.name, email: body.email, password: hash});
        res.sendStatus(201);
    } catch {
        res.status(422).send("Erro ao cadastrar");
    }
});

// post para logar um usuário
app.post('/sign-in', async (req, res) => {
    const body = req.body;
    console.log('body do login', body);
    const user = {
        email: body.email,
        password: body.password
    }

    const schema = joi.object({
        email: joi.string().required().pattern(/\S+@\S+\.\S+/),
        password: joi.string().required()
    });
    const validation = schema.validate(user);
    if(validation.error){
        console.log('Erro ao logar usuário', validation.error);
        res.status(422).send('Erro ao logar usuario');
        return;
    }

    try {
        const userdb = await database.collection('users').findOne({email: body.email});
        if (userdb && await bcrypt.compare(body.password, userdb.password)) {
            const token = v4();
            console.log('user logado', token);
            await database.collection('sessions').insertOne({token, user: userdb._id});
            res.send(userdb).status(200);
        } else {
            res.status(401).send('Usuario e/ou senha incorretos');
            console.log('Usuario e/ou senha incorretos');
        }
    } catch {
        res.status(401).send('Usuario e/ou senha incorretos');
        console.log('Usuario e/ou senha incorretos');
    }

});



app.listen(5000);

