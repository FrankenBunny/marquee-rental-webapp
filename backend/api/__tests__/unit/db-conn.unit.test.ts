jest.mock('pg', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockRejectedValue(new Error('Connection refused')),
      end: jest.fn().mockRejectedValue(new Error('Disconnect failed')),
    })),
  };
});

const { connect, disconnect } = require('../../db');

describe('(UnitTest): Database connection', () => {
    it('should throw error when failed to connect', async () => {
        await expect(connect()).rejects.toThrow();
    });

    it('should throw error when failed to disconnect', async () => {
        await expect(disconnect()).rejects.toThrow();
    });
});