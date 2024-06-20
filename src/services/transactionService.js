const connection = require('../../db');

const saveTransaction = async ({ tipo, data, moeda, valor, tipoTransacao, descricao, userId }) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO transacoes (tipo, data, moeda, valor, tipoTransacao, descricao, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [tipo, data, moeda, valor, tipoTransacao, descricao, userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fetchTransactions = async () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM transacoes';
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  saveTransaction,
  fetchTransactions
};
