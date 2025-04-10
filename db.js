// // backend/db.js
// import Database from "better-sqlite3";
// const db = new Database("shopping.db");

// // Cria a tabela se ela não existir
// db.exec(`
//   CREATE TABLE IF NOT EXISTS items (
//     id TEXT PRIMARY KEY,
//     name TEXT NOT NULL,
//     quantity INTEGER NOT NULL,
//     unit TEXT NOT NULL,
//     category TEXT NOT NULL,
//     completed INTEGER NOT NULL
//   )
// `);

// export default db;

// db.js
import pkg from "pg";
const { Pool } = pkg;

const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "shoppinglist",
});

export default db;
