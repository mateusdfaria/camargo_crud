document.addEventListener('DOMContentLoaded', function() {
    // Verifique se o Firebase está inicializado
    if (!firebase.apps.length) {
        console.error('Firebase não está inicializado corretamente.');
        alert('Ocorreu um erro ao inicializar o Firebase.');
        return;
    }

    const pagamentoForm = document.getElementById('pagamento-form');
    pagamentoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const codigoBarras = document.getElementById('codigoBarras').value;
        const valor = parseFloat(document.getElementById('valor').value);
        const descricao = document.getElementById('descricao').value;
        const moeda = document.getElementById('moeda').value;

        const user = firebase.auth().currentUser;
        if (user) {
            console.log('Usuário autenticado:', user);
            user.getIdToken().then((idToken) => {
                console.log('Token de ID obtido:', idToken);
                fetch('http://localhost:3000/api/pagamento', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + idToken
                    },
                    body: JSON.stringify({
                        codigoBarras: codigoBarras,
                        valor: valor,
                        descricao: descricao,
                        moeda: moeda
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Pagamento realizado com sucesso:', data);
                    mostrarMensagem('Pagamento realizado com sucesso!', 'success');
                })
                .catch(error => {
                    console.error('Erro ao realizar pagamento:', error);
                    mostrarMensagem('Ocorreu um erro ao realizar o pagamento.', 'error');
                });
            }).catch((error) => {
                console.error('Erro ao obter token de ID:', error);
                alert('Ocorreu um erro ao autenticar. Por favor, faça login novamente.');
            });
        } else {
            console.error('Usuário não autenticado.');
            alert('Usuário não autenticado. Por favor, faça login.');
            window.location.href = '../../index.html'; // Verifique se este caminho está correto
        }
    });
});

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
