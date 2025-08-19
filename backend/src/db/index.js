/**
 * Database connection and utility helpers using mysql2/promise.
 * The pool is lazily created using environment variables:
 * - Preferred: MYSQL_URL (e.g., mysql://user:pass@host:3306/db)
 * - Optional: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT (used only if provided)
 */

const mysql = require('mysql2/promise');

let pool = null;

/**
 * Build pool configuration either from MYSQL_URL or from individual env vars if available.
 * This does not connect immediately; connection occurs on first query.
 */
function buildPool() {
  const {
    MYSQL_URL,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
    MYSQL_PORT,
  } = process.env;

  // Prefer URL if provided
  if (MYSQL_URL && MYSQL_URL.trim()) {
    // mysql2 supports passing a connection string directly to createPool
    return mysql.createPool(MYSQL_URL.trim());
  }

  // Fallback to individual parts ONLY if a host is available
  if (MYSQL_HOST) {
    return mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
      port: MYSQL_PORT ? Number(MYSQL_PORT) : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // If we reached here, config is not sufficient
  throw new Error(
    'Database configuration missing. Provide MYSQL_URL or MYSQL_HOST with credentials.'
  );
}

// PUBLIC_INTERFACE
async function getPool() {
  /**
   * Get a singleton mysql2/promise pool. The pool is initialized on first use.
   * Returns:
   *   Promise<Pool> A mysql2 promise-based pool instance.
   */
  if (!pool) {
    pool = buildPool();
  }
  return pool;
}

// PUBLIC_INTERFACE
async function query(sql, params = []) {
  /**
   * Execute a parameterized SQL query against the pool.
   * Params:
   *   - sql: string - SQL query with placeholders
   *   - params: any[] - parameter values for placeholders
   * Returns:
   *   - Promise<any[]> - array of rows for SELECT queries
   */
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

// PUBLIC_INTERFACE
async function ping() {
  /**
   * Ping the database to ensure connectivity.
   * Returns:
   *   - Promise<boolean> - true if ping succeeds
   */
  const p = await getPool();
  await p.query('SELECT 1');
  return true;
}

module.exports = {
  getPool,
  query,
  ping,
};
