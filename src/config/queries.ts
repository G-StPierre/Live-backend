import pg from 'pg';
import 'dotenv/config'
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASS,
    port: parseInt(process.env.DATABASE_PORT),
}); 


export default pool;