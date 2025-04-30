import { atualizaDocumento, encontrarDocumento } from "./documentosDb.js";
import io from "./servidor.js";

io.on("connection", (socket) => {
  console.log("Um cliente se conectou! ID: ", socket.id); //quando um cliente se conecta na pagina (abre uma pagina no navegador)

  socket.on("selecionar_documento", async (nomeDocumento, devolverTexto) => {
    socket.join(nomeDocumento);
    const documento = await encontrarDocumento(nomeDocumento);
    if (documento) {
      devolverTexto(documento.texto);
    }
  });
  //escuta o evento do front de um ID que veio do front
  socket.on("texto_editor", async ({ texto, nomeDocumento }) => {
    const atualizacao = await atualizaDocumento(nomeDocumento, texto);
    if (atualizacao.modifiedCount) {
      socket.to(nomeDocumento).emit("texto_editor_clientes", texto); //emite para o front, para todos  os IDs conectados (sem atualizar na página)
    }
  });
});
