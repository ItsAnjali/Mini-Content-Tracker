const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dataDir = process.env.DATA_DIR || __dirname;
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'data.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id TEXT UNIQUE,
    title TEXT,
    url TEXT,
    author TEXT,
    points INTEGER,
    num_comments INTEGER,
    created_at TEXT,
    fetched_keyword TEXT,
    fetched_at TEXT
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    source TEXT,
    tags TEXT,
    file_path TEXT,
    uploaded_at TEXT
  );
`);

module.exports = db;
