const { saveTransaction, fetchTransactions } = require('../services/transactionService');

jest.mock('../../db', () => ({
  query: jest.fn((query, values, callback) => {
    if (query.startsWith('INSERT')) {
      callback(null, { insertId: 1 });
    } else if (query.startsWith('SELECT')) {
      callback(null, [{ id: 1, tipo: 'Despesa', data: '2024-05-20', moeda: 'Real', valor: 100, tipoTransacao: 'Supermercado', descricao: 'Compra no supermercado', userId: 'testUserId' }]);
    } else {
      callback(new Error('Query not supported'));
    }
  })
}));

describe('Transaction Service', () => {
  describe('saveTransaction', () => {
    it('should save a transaction', async () => {
      const transaction = {
        tipo: 'Despesa',
        data: '2024-05-20',
        moeda: 'Real',
        valor: 100,
        tipoTransacao: 'Supermercado',
        descricao: 'Compra no supermercado',
        userId: 'testUserId'
      };

      const result = await saveTransaction(transaction);
      expect(result).toEqual({ insertId: 1 });
    });

    it('should throw an error if saving fails', async () => {
      const faultyTransaction = {};
      await expect(saveTransaction(faultyTransaction)).rejects.toThrow();
    });
  });

  describe('fetchTransactions', () => {
    it('should fetch transactions', async () => {
      const result = await fetchTransactions();
      expect(result).toEqual([
        { id: 1, tipo: 'Despesa', data: '2024-05-20', moeda: 'Real', valor: 100, tipoTransacao: 'Supermercado', descricao: 'Compra no supermercado', userId: 'testUserId' }
      ]);
    });

    it('should throw an error if fetching fails', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('Failed to fetch')));
      await expect(fetchTransactions()).rejects.toThrow();
    });
  });
});
