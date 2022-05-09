import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
//import dotenv from 'dotenv';
dotenv.config();

// conectando ao banco de dados
let database = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);

try {
    await mongoClient.connect();
    database = mongoClient.db('usersDataBase');
    console.log('Conectado ao banco de dados', database);
} catch (error) {
    console.log('Erro ao conectar ao banco de dados', error);
}

export default database;