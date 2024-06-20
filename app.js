const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const firebaseAdmin = require('firebase-admin');
const connection = require('./db');
const serviceAccount = require('./serviceAccountKey.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

const app = express();
const port = 3000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware para verificar a autenticação do Firebase
function checkAuth(req, res, next) {
    const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
    if (idToken) {
        firebaseAdmin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                req.user = decodedToken;
                next();
            })
            .catch(error => {
                res.status(401).send('Unauthorized');
            });
    } else {
        res.status(401).send('Unauthorized');
    }
}

// Endpoint para criar uma conta
app.post('/api/criar-conta', checkAuth, (req, res) => {
    const { nome, saldo } = req.body;

    const query = 'INSERT INTO contas (nome, saldo) VALUES (?, ?)';
    connection.query(query, [nome, saldo], (err, results) => {
        if (err) {
            console.error('Erro ao criar conta:', err);
            res.status(500).send('Error creating account');
        } else {
            res.status(201).send('Account created successfully');
        }
    });
});

// Endpoint para buscar todas as contas
app.get('/api/contas', checkAuth, (req, res) => {
    const query = 'SELECT * FROM contas';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar contas:', err);
            res.status(500).send('Error fetching accounts');
        } else {
            res.json(results);
        }
    });
});

// Endpoint para adicionar transações
app.post('/api/transacao', checkAuth, (req, res) => {
    const { tipo, data, moeda, valor, tipoTransacao, descricao } = req.body;
    const userId = req.user.uid;

    const query = 'INSERT INTO transacoes (tipo, data, moeda, valor, tipoTransacao, descricao, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [tipo, data, moeda, valor, tipoTransacao, descricao, userId], (err, results) => {
        if (err) {
            console.error('Erro ao criar transação:', err);
            res.status(500).send('Error creating transaction');
        } else {
            res.status(201).send('Transaction created successfully');
        }
    });
});

// Endpoint para buscar transações de um usuário específico
app.get('/api/transacoes/:userId', checkAuth, (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT * FROM transacoes WHERE userId = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar transações:', err);
            res.status(500).send('Error fetching transactions');
        } else {
            res.json(results);
        }
    });
});

// Endpoint para realizar pagamento
app.post('/api/pagamento', checkAuth, (req, res) => {
    const { contaId, valor, descricao } = req.body;

    const queryGetSaldo = 'SELECT saldo FROM contas WHERE id = ?';
    connection.query(queryGetSaldo, [contaId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar saldo:', err);
            res.status(500).send('Error fetching balance');
        } else {
            const saldoAtual = results[0].saldo;
            if (saldoAtual >= valor) {
                const novoSaldo = saldoAtual - valor;
                const queryUpdateSaldo = 'UPDATE contas SET saldo = ? WHERE id = ?';
                connection.query(queryUpdateSaldo, [novoSaldo, contaId], (err, results) => {
                    if (err) {
                        console.error('Erro ao atualizar saldo:', err);
                        res.status(500).send('Error updating balance');
                    } else {
                        const queryInsertTransacao = 'INSERT INTO transacoes (tipo, data, moeda, valor, tipoTransacao, descricao, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
                        const dataAtual = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        connection.query(queryInsertTransacao, ['Despesa', dataAtual, 'BRL', valor, 'Pagamento', descricao, req.user.uid], (err, results) => {
                            if (err) {
                                console.error('Erro ao criar transação:', err);
                                res.status(500).send('Error creating transaction');
                            } else {
                                res.status(201).send('Payment made successfully');
                            }
                        });
                    }
                });
            } else {
                res.status(400).send('Saldo insuficiente');
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
