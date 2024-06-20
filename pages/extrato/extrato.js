window.addEventListener('load', function() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            user.getIdToken().then(idToken => {
                const userId = user.uid;
                fetch(`http://localhost:3000/api/transacoes/${userId}`, {
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
                    const tbody = document.getElementById('transacoes-table').getElementsByTagName('tbody')[0];
                    tbody.innerHTML = ''; // Limpar o conteúdo existente
                    data.forEach(transacao => {
                        const row = tbody.insertRow();
                        row.insertCell(0).innerText = transacao.tipo;
                        row.insertCell(1).innerText = new Date(transacao.data).toLocaleString();
                        row.insertCell(2).innerText = transacao.moeda;
                        row.insertCell(3).innerText = transacao.valor;
                        row.insertCell(4).innerText = transacao.tipoTransacao;
                        row.insertCell(5).innerText = transacao.descricao;
                    });
                })
                .catch(error => {
                    console.error('Error fetching transactions:', error);
                    alert('Ocorreu um erro ao buscar o extrato.');
                });
            }).catch(error => {
                console.error('Erro ao obter o token de autenticação:', error);
            });
        } else {
            console.log('Usuário não está logado');
        }
    });
});

function voltarParaHome() {
    window.location.href = '../home/home.html';
}
