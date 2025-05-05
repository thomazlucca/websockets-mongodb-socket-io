import {
  adicionarDocumento,
  atualizaDocumento,
  encontrarDocumento,
  excluirDocumento,
  obterDocumentos,
} from "./documentosDb.js";
import io from "./servidor.js";

io.on("connection", (socket) => {
  console.log("Um cliente se conectou! ID: ", socket.id); //quando um cliente se conecta na pagina (abre uma pagina no navegador)
  socket.on("obter_documentos", async (devolverDocumentos) => {
    const documentos = await obterDocumentos();
    devolverDocumentos(documentos);
  });

  socket.on("adicionar_documento", async (nome) => {
    const documentoExiste = (await encontrarDocumento(nome)) !== null;
    if (documentoExiste) {
      socket.emit("documento_existente", nome);
    } else {
      const resultado = await adicionarDocumento(nome);
      if (resultado.acknowledged) {
        io.emit("adicionar_documento_interface", nome);
      }
    }
  });

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
  socket.on("excluir_documento", async (nome) => {
    const resultado = await excluirDocumento(nome);
    if (resultado.deletedCount) {
      io.emit("excluir_documento_sucesso", nome);
    }
  })
});
