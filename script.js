let nomeUsuario;
let usuario;
let mensagem;
let mensagemDigitada;

function login() {
    nomeUsuario = prompt("Digite seu nome de usuário: ");
    usuario = { 
        name: nomeUsuario 
    };

    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    requisicao.then(entrouNaSala);
    requisicao.catch(falhaNoLogin);
}

function entrouNaSala() {
   console.log("entrou");
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
    conexao.then(continuaOnline);
    conexao.catch(saiuDaSala);
}

function continuaOnline(){
    console.log("Continua online...");
}

function saiuDaSala() {
    window.location.reload();
}

function carregarMensagens(){
    let mensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    console.log(mensagens);
    mensagens.then(renderizarMensagens); 
    mensagens.catch(erroAoCarregarMensagens);
}

function renderizarMensagens(mensagensDoServidor) {
    let arrayMensagens = mensagensDoServidor.data;
    let imprimir = document.querySelector(".chat");

    for(let i = 0; i < arrayMensagens.length; i++){
        if (arrayMensagens[i].type === 'status'){
            imprimir.innerHTML = imprimir.innerHTML + `
            <p class="status"><time>(${arrayMensagens[i].time}) </time><strong>${arrayMensagens[i].from} </strong>${arrayMensagens[i].text}</p>
            `
        } else if (arrayMensagens[i].type === 'message'){
            imprimir.innerHTML = imprimir.innerHTML + `
            <p class="message"><time>(${arrayMensagens[i].time}) </time><strong>${arrayMensagens[i].from} </strong> para <strong>${arrayMensagens[i].to}</strong>: ${arrayMensagens[i].text}</p>
            `
        } else if (arrayMensagens[i].type === 'private_message' && arrayMensagens[i].to === nomeUsuario){
            imprimir.innerHTML = imprimir.innerHTML + `
            <p class="private-message"><time>(${arrayMensagens[i].time}) </time><strong>${arrayMensagens[i].from} </strong> reservadamente para <strong>${arrayMensagens[i].to}</strong>: ${arrayMensagens[i].text}</p>
            `
        }    
    }

    imprimir.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function erroAoCarregarMensagens(erro) {
    console.log(erro);
    window.location.reload();
}

function enviarMensagem(){
    mensagemDigitada = document.querySelector("input").value;

    // no envio da mensagem informar o remetente, destinatário e se a mensagem é reservada ou não (ao fazer o bônus)

    mensagem = {
        from: `${nomeUsuario}`,
        to: "Todos",
        text: `${mensagemDigitada}`,
        type: "message"
    };

    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    requisicao.then(atualizarChat); 
    requisicao.catch(erroDeEnvio); 
}

function atualizarChat() {
    // requisição aceita = enviar mensagem e atualizar o chat com a nova mensagem
    renderizarMensagens();
}

function erroDeEnvio(erro) {
    console.log(erro);
    console.log("O usuário não está mais na sala");
    window.location.reload();
}

login();

