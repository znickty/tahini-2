import mysql from 'mysql2/promise';

let pool = null;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQLHOST || 'localhost',
      user: process.env.MYSQLUSER || 'tahini_miz',
      password: process.env.MYSQLPASSWORD || 'hGZPaLArzreWDtQcrdlJWDeKOvFtieKR',
      database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'tahini_house',
      port: Number(process.env.MYSQLPORT) || 3306,
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