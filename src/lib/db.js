import mysql from 'mysql2/promise';

let pool = null;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'tahini_user',
      password: process.env.DATABASE_PASSWORD || 'tahini_password',
      database: process.env.DATABASE_NAME || 'tahini_house',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool.getConnection();
}

export async function query(sql, params) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

export default { getConnection, query };