document.addEventListener('DOMContentLoaded', function() {
    const realizarDepositoBtn = document.getElementById('realizar-deposito');
    realizarDepositoBtn.addEventListener('click', function() {
        // Obter os valores dos campos de entrada
        const valor = document.getElementById('valor').value;
        const descricao = document.getElementById('descricao').value;

        
        if (!valor || !descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        
        criarDeposito(valor, descricao);
    });
});

function criarDeposito(valor, descricao) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;

            console.log('Dados do depósito:', {
                userId: userId,
                valor: valor,
                descricao: descricao
            });

            fetch('http://localhost:3000/api/transacao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    tipo: 'Receita',
                    data: new Date().toISOString(),
                    moeda: 'BRL',
                    valor: valor,
                    tipoTransacao: 'Depósito',
                    descricao: descricao
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta do depósito:', data);
                mostrarMensagem('Depósito realizado com sucesso!', 'success');
            })
            .catch(error => {
                console.error('Erro ao realizar o depósito:', error);
                mostrarMensagem('Ocorreu um erro ao realizar o depósito.', 'error');
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
