const { connect, disconnect, query } = require('../../db');

describe('(IntegrationTest): Database connection', () => {
  it('should connect without throwing', async() => {
     await expect(connect()).resolves.not.toThrow();
  });

  it('should query the database', async() => {
      await expect(query('SELECT * FROM app_user')).resolves.not.toThrow();
   });

  it('should disconnect without throwing', async() => {
     await expect(disconnect()).resolves.not.toThrow();
  });
});