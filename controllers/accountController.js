import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import dayjs from 'dayjs';

import { MongoClient } from 'mongodb';
import database from '../database.js';

export async function getAccount(req, res) {
    const {user} = res.locals;

    try {
        console.log('user', user);
        res.send(user).status(200);
    } catch {
            res.status(404).send('TOKEN inválido');
            console.log('TOKEN inválido');
        }
}

export async function postAccount(req, res) {
    const {authorization} = req.headers;
    const balance = {
        description: req.body.description,
        value: req.body.value,
        type: req.body.type
    };
    const schema = joi.object({
        description: joi.string().required(),
        value: joi.number().required(),
        type: joi.string().required()
    });
    const validation = schema.validate(balance);
    const validateType = (req.body.type === 'income' || req.body.type === 'outcome');
    if(validation.error || !validateType) {
        console.log('Erro ao adicionar saldo', validation.error);
        res.status(422).send('Erro ao adicionar saldo');
        return;
    }
    const token = authorization?.replace('Bearer', '').trim();
    if(!token) return res.sendStatus(401);

    try {
        const session = await database.collection('sessions').findOne({token});
        if(!session) return res.sendStatus(401);

        await database.collection('balances').insertOne({user: session.user, date: dayjs().format('DD/MM'), ...balance});
        res.sendStatus(201);

    } catch {
        res.status(404).send('TOKEN inválido');
    }
}