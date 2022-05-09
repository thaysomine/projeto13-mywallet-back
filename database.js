import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// conectando ao banco de dados
let database = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();
promise.then(()=> {
    database = mongoClient.db('usersDataBase');
    console.log('Conectado ao banco de dados');
});
promise.catch((err) => console.log(err));

export default database;