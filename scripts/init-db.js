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
    tags TEXT DEFAULT '[]',
    published INTEGER DEFAULT 0,
    viewCount INTEGER DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT
  )
`);

// Add columns to existing databases (no-op if already exists)
try {
  db.exec("ALTER TABLE Post ADD COLUMN viewCount INTEGER DEFAULT 0");
} catch (e) {
  // ignore "duplicate column name" errors
}
try {
  db.exec("ALTER TABLE Post ADD COLUMN tags TEXT DEFAULT '[]'");
} catch (e) {
  // ignore "duplicate column name" errors
}
console.log('Schema initialized');
db.close();