import { atualizaTextoEditor } from "./documento.js";

const socket = io();

function selecionarDocumento(nome) {
    socket.emit("selecionar_documento", nome, (texto) => {
        atualizaTextoEditor(texto);
    });
}
//função que emite o texto_editor para o back
function emitirTextoEditor(dados) {
    socket.emit("texto_editor", dados); 
}
//escuta o que veio do back e chama a função para atualizar a página
socket.on("texto_editor_clientes", (texto) => {
    atualizaTextoEditor(texto);
});

export { emitirTextoEditor, selecionarDocumento };