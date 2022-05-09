import database from "../database.js";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import dayjs from 'dayjs';

export async function validJoiSignup (req, res, next) {
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
    next();
}

export async function validJoiSignin (req, res, next) {
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
    next();
}