document.addEventListener('DOMContentLoaded', function() {
    const contaForm = document.getElementById('conta-form');
    const contasTableBody = document.getElementById('contas-table-body');

    // Verificar autenticação do usuário e carregar contas
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            carregarContas(user);
        } else {
            console.error('Usuário não autenticado.');
            alert('Usuário não autenticado. Por favor, faça login.');
        }
    });

    contaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const saldo = parseFloat(document.getElementById('saldo').value);
        const user = firebase.auth().currentUser;

        if (user) {
            user.getIdToken().then((idToken) => {
                fetch('http://localhost:3000/api/criar-conta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + idToken
                    },
                    body: JSON.stringify({ nome, saldo })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    alert('Conta criada com sucesso!');
                    carregarContas(user);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocorreu um erro ao criar a conta.');
                });
            });
        } else {
            alert('Usuário não autenticado');
        }
    });

    function carregarContas(user) {
        user.getIdToken().then((idToken) => {
            fetch('http://localhost:3000/api/contas', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + idToken
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                contasTableBody.innerHTML = ''; // Limpar conteúdo existente
                data.forEach(conta => {
                    const row = contasTableBody.insertRow();
                    row.insertCell(0).innerText = conta.nome;
                    row.insertCell(1).innerText = conta.saldo;
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocorreu um erro ao carregar as contas.');
            });
        });
    }
});
function voltarParaHome() {
    window.location.href = '../home/home.html';
}
