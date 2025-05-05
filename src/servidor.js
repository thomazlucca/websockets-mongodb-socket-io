import express from "express"; //importa a biblioteca express
import url from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import "./dbConnect.js"

const app = express();
const porta = process.env.porta || 3000;

const caminhoAtual = url.fileURLToPath(import.meta.url); //pega o caminha atual que estamos até o arquivo servidor.js
const diretorioPublico = path.join(caminhoAtual, "../..", "public"); // pega o caminho atual no primeiro parametro, pega sobe 2 niveis e vai até a pasta public
app.use(express.static(diretorioPublico)); //cria um caminho estatico com o express em public

const servidorHttp = http.createServer(app); //cria um servidorhttp no diretorio public

servidorHttp.listen(porta, () => console.log(`Servidor escutando na porta ${porta}`)); //escuta a porta 3000 definida no servidor

const io = new Server(servidorHttp); //cria uma variavel do websocket para utilizar no servidor http

export default io;