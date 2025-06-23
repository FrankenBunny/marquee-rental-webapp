const request = require('supertest');
const app = require('../../../server.js');

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

describe('(UnitTest): /api/user POST', () => {
    it('should not create user with undefined username', async () => {
        var given_username = undefined;
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

        expect(response.statusCode).toBe(400);
    });

    it('should not create user with undefined name', async () => {
        var given_username = 'testUserName';
        var given_name = undefined;
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

        expect(response.statusCode).toBe(400);
    });

    it('should not create user with undefined email', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot';
        var given_email = undefined;
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

    it('should not create user with invalid email', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot';
        var given_email = 'notanemail';
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

    it('should not create user without password', async () => {
        var given_username = 'testUserName';
        var given_name = 'Tests Alot';
        var given_email = 'TESTING@email.com';
        var given_password = undefined;

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