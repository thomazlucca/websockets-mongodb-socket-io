import io from "./servidor.js";

const documentos = [
    {
        nome: "JavaScript",
        texto: "texto de javascript..."
    },
    {
        nome: "Node",
        texto: "texto de node..."
    },
    {
        nome: "Socket.io",
        texto: "texto de socket.io..."
    },
];

io.on("connection", (socket) => {
    console.log("Um cliente se conectou! ID: ", socket.id); //quando um cliente se conecta na pagina (abre uma pagina no navegador)

    socket.on("selecionar_documento", (nomeDocumento, devolverTexto) => {
        socket.join(nomeDocumento);
        const documento = encontrarDocumento(nomeDocumento);
        if (documento) {
         devolverTexto(documento.texto);
        }
    });
    //escuta o evento do de um ID que veio do front
    socket.on("texto_editor", ({ texto, nomeDocumento }) => {
        const documento = encontrarDocumento(nomeDocumento);
        if (documento) {
            documento.texto = texto;
            socket.to(nomeDocumento).emit("texto_editor_clientes", texto); //emite para o front, para todos  os IDs conectados (sem atualizar na página)
        }
    });
});

function encontrarDocumento(nome) {
    const documento = documentos.find((documento) => {
        return documento.nome === nome;
    });
    return documento;
}