document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            user.getIdToken().then(idToken => {
                fetch(`http://localhost:3000/api/transacoes/${user.uid}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Processar os dados das transações
                    console.log(data);
                    // Atualizar o saldo na interface do usuário
                    atualizarSaldo(data);
                })
                .catch(error => {
                    console.error('Error fetching transactions:', error);
                });
            });
        } else {
            console.error('Usuário não autenticado.');
            alert('Usuário não autenticado. Por favor, faça login.');
        }
    });
});

function atualizarSaldo(transacoes) {
    // Lógica para calcular e exibir o saldo com base nas transações
    let saldo = 0;
    transacoes.forEach(transacao => {
        if (transacao.tipo === 'Receita') {
            saldo += transacao.valor;
        } else if (transacao.tipo === 'Despesa') {
            saldo -= transacao.valor;
        }
    });
    document.getElementById('saldo').innerText = `Saldo: R$ ${saldo.toFixed(2)}`;
}

function voltarParaHome() {
    window.location.href = '../home/home.html';
  }