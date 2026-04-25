import mysql from 'mysql2/promise';
import { DB_CONFIG } from '../config/config.js';

let pool;

const initializePool = async () => {
  try {
    pool = mysql.createPool({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      port: DB_CONFIG.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('✅ Connected to MySQL database');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
};

initializePool();

export const query = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return { rows };
  } finally {
    connection.release();
  }
};

export const getConnection = () => pool.getConnection();

export default pool;
