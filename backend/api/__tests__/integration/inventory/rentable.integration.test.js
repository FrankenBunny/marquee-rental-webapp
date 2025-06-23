const request = require('supertest');
const client = require('../../../db.js')
const app = require('../../../server.js');
require('dotenv').config();

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.disconnect();
});

describe('(IntegrationTest): POST /api/rentable', () => {
  it('should create a rentable with description', async () => {
    const name = "Test Tent";
    const description = "Some description";
    const response = await request(app)
      .post('/api/rentable')
      .send({ name, description});

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(name);
    expect(response.body.description).toBe(description);
  });

  
  it('should create a rentable without description', async () => {
    const name = "Test Tent 2";
    const description = undefined;

    const response = await request(app)
      .post('/api/rentable')
      .send({ name, description});

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(name);
    expect(response.body.description).toBe(null);
  });

  /*
  it('should not create rentable with name > 32 char', async () => {
    const response = await request(app)
      .post('/rentable')
      .send({ name: 'name'.repeat(33), description: undefined });

    expect(response.statusCode).toBe(500);
    expect(response.body.name).toBe('Test Tent');
    expect(response.body.description).toBe(undefined);
  });
  */
});
