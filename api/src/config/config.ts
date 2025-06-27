import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number,
    frontendPort: number,
    frontendOrigin?: string,
    nodeEnv: string,
    clientConfig: {
        user: string,
        host: string,
        database: string,
        password: string,
        port: number,
        statement_timeout: number,
    }
}

const config: Config = {
    port: Number(process.env.API_PORT) || 8888,
    frontendPort: Number(process.env.FRONTEND_PORT),
    frontendOrigin: process.env.FRONTEND_ORIGIN,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientConfig: {
        user: process.env.POSTGRES_USER || 'postgres',
        host: process.env.POSTGRES_HOST || 'db',
        database: process.env.POSTGRES_DB || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
        port: Number(process.env.DB_PORT) || 5432,
        statement_timeout: 5000,
    }
}

export default config;