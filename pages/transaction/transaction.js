document.addEventListener('DOMContentLoaded', function() {
    const salvarTransacaoBtn = document.getElementById('salvar-transacao');
    salvarTransacaoBtn.addEventListener('click', function() {
        console.log('Botão Salvar Transação clicado'); // Log para verificar clique no botão
  
        const tipo = document.querySelector('input[name="type"]:checked').value;
        const data = document.getElementById('data').value;
        const moeda = document.getElementById('moeda').value;
        const valor = document.getElementById('valor').value;
        const tipoTransacao = document.getElementById('tipoTransacao').value;
        const descricao = document.getElementById('descricao').value;
  
        if (!data || !valor || !tipoTransacao || !descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
  
        criarTransacao(tipo, data, moeda, valor, tipoTransacao, descricao);
    });
  });
  
  function criarTransacao(tipo, data, moeda, valor, tipoTransacao, descricao) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            user.getIdToken().then(idToken => {
                const userId = user.uid;
  
                console.log('Dados da transação:', {
                    userId: userId,
                    tipo: tipo,
                    data: data,
                    moeda: moeda,
                    valor: valor,
                    tipoTransacao: tipoTransacao,
                    descricao: descricao
                });
  
                fetch('http://localhost:3000/api/transacao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        tipo: tipo,
                        data: data,
                        moeda: moeda,
                        valor: valor,
                        tipoTransacao: tipoTransacao,
                        descricao: descricao
                    })
                })
                .then(response => {
                    console.log('Resposta recebida:', response); // Adicionar log da resposta
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Resposta da criação de transação:', data);
                    mostrarMensagem('Transação salva com sucesso!', 'success');
                })
                .catch(error => {
                    console.error('Erro ao criar a transação:', error);
                    mostrarMensagem('Ocorreu um erro ao criar a transação.', 'error');
                });
            }).catch(error => {
                console.error('Erro ao obter o token de autenticação:', error);
            });
        } else {
            console.log('Usuário não está logado');
        }
    });
  }
  
  function mostrarMensagem(mensagem, tipo) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = mensagem;
    messageDiv.className = tipo; 
  
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 5000); 
  }
  
  function voltarParaHome() {
    window.location.href = '../home/home.html';
  }
  