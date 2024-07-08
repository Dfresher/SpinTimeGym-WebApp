import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS clients (id TEXT, name TEXT, joinDate TEXT)");
});

app.get('/clients', (req, res) => {
  db.all("SELECT * FROM clients", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/clients', (req, res) => {
  const { name, joinDate } = req.body;
  const id = uuidv4();
  db.run(`INSERT INTO clients (id, name, joinDate) VALUES (?, ?, ?)`, [id, name, joinDate], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.status(201).json({ id, name, joinDate });
  });
});

app.delete('/clients/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM clients WHERE id = ?`, id, function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.status(204).end();
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
