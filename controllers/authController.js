import bcrypt from 'bcrypt';
import {v4} from 'uuid';

import database from './../database.js';

export async function getSignUp(req, res) {
    const body = req.body;
    console.log('body do cadastro', body);
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
}

export async function getSignIn(req, res) {
    const body = req.body;
    console.log('body do login', body);

    try {
        const userdb = await database.collection('users').findOne({email: body.email});
        if (userdb && await bcrypt.compare(body.password, userdb.password)) {
            const token = v4();
            console.log('user logado', token);
            await database.collection('sessions').insertOne({token, user: userdb._id, name: userdb.name});
            const user = await database.collection('sessions').findOne({token});

            delete user._id;
            res.send(user).status(200);
        } else {
            res.status(401).send('Usuario e/ou senha incorretos');
            console.log('Usuario e/ou senha incorretos');
        }
    } catch {
        res.status(401).send('Usuario e/ou senha incorretos');
        console.log('Usuario e/ou senha incorretos');
    }
}

export async function deleteUser(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    if(!token) return res.sendStatus(401);

    try {
        const session = await database.collection('sessions').findOne({token});
        if(!session) return res.sendStatus(401);

        await database.collection('sessions').deleteOne({token});
        res.sendStatus(200);
    } catch {
        res.status(404).send('TOKEN inválido');
    }
}