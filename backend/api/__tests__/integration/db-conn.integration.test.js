const { connect, disconnect } = require('../../db'); // adjust path as needed

describe('(IntegrationTest): Database connection', () => {
  it('should connect without throwing', async() => {
     await expect(connect()).resolves.not.toThrow();
  });

  it('should disconnect without throwing', async() => {
     await expect(disconnect()).resolves.not.toThrow();
  });
});