import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config(); //inicia o dotenv

const cliente = new MongoClient(process.env.DB_CONNECTION_STRING);

let documentosColecao;

try {
    await cliente.connect();
    const db = cliente.db("alura-websockets");
    documentosColecao = db.collection("documentos");

    console.log("Conectado ao Banco de Dados com sucesso!")

} catch (erro) {
    console.log(erro);
}

export { documentosColecao };