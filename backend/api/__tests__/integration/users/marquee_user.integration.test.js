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

beforeEach(async () => {
    await client.query('TRUNCATE TABLE app_user RESTART IDENTITY CASCADE');
});

/**
 * 
 * CREATE TABLE app_user (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      username VARCHAR(32) NOT NULL UNIQUE,
 *      name VARCHAR(100) NOT NULL,
 *      email VARCHAR(254) NOT NULL UNIQUE,
 *      password_hash VARCHAR(255) NOT NULL,
 *      created_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 */
describe('(IntegrationTest): /api/user GET (pre POST)', () => {
    it('should get an empty list if no users are added', async () => {
        const response = await request(app)
            .get('/api/user');
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
    });

    it('should get a list if users are added', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot';
        var given_email = 'TESTING@email.com';
        var given_password = 'test123';

        await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });
            
        const response = await request(app)
            .get('/api/user');
        
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
    });
});

describe('(IntegrationTest): /api/user POST', () => {
    it('should create user and return 201 with valid input', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot';
        var given_email = 'TESTING@email.com';
        var given_password = 'test123';

        const response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.username).toBe(given_username.toLowerCase());
        expect(response.body.name).toBe(given_name);
        expect(response.body.email).toBe(given_email.toLowerCase());
    });

    it('should not create user if duplicate key violation on username', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot 2';
        var given_email = 'TESTING2@email.com';
        var given_password = 'test123';

        const response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });
        
        const duplicate_response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        expect(duplicate_response.statusCode).toBe(409);
    });

    it('should not create user if duplicate key violation on email', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot 2';
        var given_email = 'TESTING@email.com';
        var given_password = 'test123';

        const response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        const duplicate_response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        expect(duplicate_response.statusCode).toBe(409);
    });

    it('should not create user with too long username', async () => {
        var given_username = 'a'.repeat(300);
        var given_name = 'Tests Alot 2';
        var given_email = 'TESTING2@email.com';
        var given_password = 'test123';

        const response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        expect(response.statusCode).toBe(400);
    });

    it('should not create user with too long name', async () => {
        var given_username = 'testUserName2';
        var given_name = 'a'.repeat(300);
        var given_email = 'TESTING2@email.com';
        var given_password = 'test123';

        const response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        expect(response.statusCode).toBe(400);
    });

    it('should not create user with too long email', async () => {
        var given_username = 'testUserName2';
        var given_name = 'Tests Alot 2';
        var given_email = 'a'.repeat(300) + 'TESTING2@email.com';
        var given_password = 'test123';

        const response = await request(app)
            .post('/api/user')
            .send({ 
                username: given_username, 
                name: given_name,
                email: given_email,
                password: given_password
            });

        expect(response.statusCode).toBe(400);
    });
});