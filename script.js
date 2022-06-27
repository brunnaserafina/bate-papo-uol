let nomeUsuario;
let usuario;
let mensagem;
let mensagemDigitada;

function login() {
    nomeUsuario = document.querySelector(".nome-usuario").value;
    usuario = { 
        name: nomeUsuario 
    };
    document.querySelector(".tela-de-entrada").classList.add("escondida");
    document.querySelector(".entrando").classList.remove("escondida");

    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    requisicao.then(entrouNaSala);
    requisicao.catch(falhaNoLogin);
}

function entrouNaSala() {
   console.log("entrou");
   document.querySelector(".entrando").classList.add("escondida");
   document.querySelector(".telaChatMensagens").classList.remove("escondida"); 
   setInterval(carregarMensagens, 3000);
   setInterval(manterConexao, 5000); 
}

function falhaNoLogin(erro){
   if(Number(erro.response.status) === 400) {
    alert("Usuário já existente! Escolha outro nome de usuário.");
    window.location.reload();
   } else {
    alert(erro);
    window.location.reload();
   }
}

function manterConexao(){
    let conexao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
    conexao.then(() => {console.log("Continua online...")});
    conexao.catch(() => {window.location.reload();});
}

function carregarMensagens(){
    let mensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    //console.log(mensagens);
    mensagens.then(renderizarMensagens); 
    mensagens.catch(() => {window.location.reload();});
}

function renderizarMensagens(mensagensDoServidor) {
    document.querySelector('body').classList.add("fundo-chat");
    let arrayMensagens = mensagensDoServidor.data;
    let chat = document.querySelector(".chat");

    for(let i = 0; i < arrayMensagens.length; i++){
        if (arrayMensagens[i].type === 'status'){
            chat.innerHTML = chat.innerHTML + `
            <p class="status"><time>(${arrayMensagens[i].time}) </time><strong> ${arrayMensagens[i].from} </strong> ${arrayMensagens[i].text}</p>
            `
        } else if (arrayMensagens[i].type === 'message'){
            chat.innerHTML = chat.innerHTML + `
            <p class="message"><time>(${arrayMensagens[i].time}) </time><strong> ${arrayMensagens[i].from} </strong> para <strong>${arrayMensagens[i].to}</strong>: ${arrayMensagens[i].text}</p>
            `
        } else if (arrayMensagens[i].type === 'private_message' && arrayMensagens[i].to === nomeUsuario){
            chat.innerHTML = chat.innerHTML + `
            <p class="private-message"><time>(${arrayMensagens[i].time}) </time><strong> ${arrayMensagens[i].from} </strong> reservadamente para <strong>${arrayMensagens[i].to}</strong>: ${arrayMensagens[i].text}</p>
            `
        }    
    }

    chat.lastElementChild.scrollIntoView();
}

function enviarMensagem(){
    mensagemDigitada = document.querySelector(".envio-mensagem").value;

    mensagem = {
        from: `${nomeUsuario}`,
        to: "Todos",
        text: `${mensagemDigitada}`,
        type: "message"
    };

    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    requisicao.then(atualizarChat); 
    requisicao.catch(() => {window.location.reload();}); 

}

function atualizarChat() {
    document.querySelector(".envio-mensagem").value = "";
    renderizarMensagens();
}

function enviarComEnter(){
    document.querySelector(".envio-mensagem").addEventListener("keypress", function(e) {
        if(e.key === 'Enter') {
            enviarMensagem();
        }
      });
}

function enviarComEnter2(){
    document.querySelector(".nome-usuario").addEventListener("keypress", function(b) {
        if(b.key === 'Enter') {
            login();
        }
      });
}

enviarComEnter();
enviarComEnter2();


