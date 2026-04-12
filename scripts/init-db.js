const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve('/app/data/dev.db');

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS Post(
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    published INTEGER DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT
  )
`);
console.log('Schema initialized');
db.close();