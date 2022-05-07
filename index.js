import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';

const app = express();
app.use(express.json()); 
app.use(cors());

app.listen(5000);