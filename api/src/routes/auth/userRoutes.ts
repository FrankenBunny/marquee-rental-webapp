import express, { Router } from 'express';
import type { Response, Request, NextFunction } from 'express';
import db from '../../db/client.js';
import type { AppError } from '../../middlewares/errorHandler.js';

const router: Router = express.Router();

router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    let { username, email } = req.body;
    const { name, password } = req.body;

    username = username.toLowerCase();
    email = email.toLowerCase();

    try {
        const result = await db.query(
            'INSERT INTO app_user (username, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, name, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        const appErr: AppError = new Error('Failed to fetch users');
        appErr.status = 500;
        appErr.cause = error;
        next(appErr);
    }
});

router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await db.query('SELECT * FROM app_user');
        res.status(200).json(result.rows);
    } catch (error) {
        const appErr: AppError = new Error('Failed to fetch users');
        appErr.status = 500;
        appErr.cause = error;
        next(appErr);
    }
});

router.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM app_user WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(result.rows);
    } catch (error) {
        const appErr: AppError = new Error('Failed to fetch user with given id: ' + id);
        appErr.status = 500;
        appErr.cause = error;
        next(appErr);
    }
});

router.delete('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM app_user WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted', user: result.rows[0] });
    } catch (error) {
        const appErr: AppError = new Error('Failed to delete user with given id: ' + id);
        appErr.status = 500;
        appErr.cause = error;
        next(appErr);
    }
});

export default router;