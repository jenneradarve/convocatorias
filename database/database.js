const Database = require("better-sqlite3");

const db = new Database("database.sqlite");

db.prepare(`
CREATE TABLE IF NOT EXISTS postulaciones (

id INTEGER PRIMARY KEY AUTOINCREMENT,

usuario TEXT,

discord TEXT,

estado TEXT,

fecha TEXT,

datos TEXT

)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS sanciones (

id INTEGER PRIMARY KEY AUTOINCREMENT,

usuario TEXT,

tipo TEXT,

motivo TEXT,

evidencias TEXT,

staff TEXT,

fecha TEXT

)
`).run();

module.exports = db;
