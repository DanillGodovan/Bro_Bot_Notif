const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

module.exports = {
  initialize: () => {
    return new Promise((resolve, reject) => {
      db.run(`CREATE TABLE IF NOT EXISTS notifications (id TEXT, pubDate TEXT)`, [], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
  getLastCheckedVideo: () => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM notifications ORDER BY rowid DESC LIMIT 1`, [], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  },
  updateLastCheckedVideo: (id, pubDate) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO notifications (id, pubDate) VALUES (?, ?)`, [id, pubDate], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
  reset: () => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM notifications`, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
};