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
   alert("entrou");
   //função para carregar as mensagens
   setInterval(carregarMensagens, 3000);
   //função para verificar se está online
   setInterval(manterConexao, 5000);
}

function falhaNoLogin(erro){
   alert(erro);
   // se for erro 400 pedir o nome de usuário novamente
   // se for outro erro informar o erro
}

function manterConexao(){
    let conexao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
    conexao.then(continuaOnline); // permanecer na página
    conexao.catch(saiuDaSala); // recarregar a página (window.location.reload())
}

function carregarMensagens(){
    let mensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    console.log(mensagens);
    mensagens.then(); // ao carregar renderizar as mensagens no html para o cliente, chat deve ter rolagem automática por padrão (utilizar scrollIntoView)
    mensagens.catch(); // ao não carregar mostrar o erro e recarregar a página
}

function enviarMensagens(){
    mensagemDigitada = document.querySelector("input").value;

    // no envio da mensagem informar o remetente, destinatário e se a mensagem é reservada ou não (ao fazer o bônus)

    mensagem = {
        from: `${nomeUsuario}`,
        to: "Todos",
        text: `${mensagemDigitada}`,
        type: "message"
    }

    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    requisicao.then(); // requisição aceita = enviar mensagem e atualizar o chat com a nova mensagem
    requisicao.catch(); // informar erro, significa que o usário não está mais na sala e deve recarregar a página (window.location.reload())
}

login();

