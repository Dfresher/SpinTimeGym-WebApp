import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import sqlite3 from "sqlite3";
import dayjs from "dayjs";

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.sqlite");
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  // Clients table with isCheckedIn field
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT,
      joinDate TEXT,
      lastPaymentDate TEXT,
      isCheckedIn BOOLEAN DEFAULT FALSE
    )
  `);

  // Payment table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      paymentDate TEXT,
      amount REAL,
      FOREIGN KEY(clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);

  // Attendance table
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      checkInTime TEXT,
      checkOutTime TEXT,
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
    )
  `);
});

// Get all clients
app.get("/clients", (req, res) => {
  db.all("SELECT * FROM clients", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add a new client
app.post("/clients", (req, res) => {
  const { name, joinDate, lastPaymentDate } = req.body;
  const id = uuidv4();
  db.run(
    `INSERT INTO clients (id, name, joinDate, lastPaymentDate) VALUES (?, ?, ?, ?)`,
    [id, name, joinDate, lastPaymentDate],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ id, name, joinDate, lastPaymentDate, isCheckedIn: false });
    }
  );
});

// Handle payments
app.post("/clients/:id/payment", (req, res) => {
  const clientId = req.params.id;
  const { amount } = req.body;
  const paymentDate = dayjs().format();
  const paymentId = uuidv4();

  console.log("Client ID:", clientId);

  db.serialize(() => {
    db.get(`SELECT id FROM clients WHERE id = ?`, [clientId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(400).json({ error: "Client does not exist" });
      }
      db.run(
        `INSERT INTO payments (id, clientId, paymentDate, amount) VALUES (?, ?, ?, ?)`,
        [paymentId, clientId, paymentDate, amount],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.run(
            `UPDATE clients SET lastPaymentDate = ? WHERE id = ?`,
            [paymentDate, clientId],
            function (updateErr) {
              if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
              }
              res
                .status(200)
                .json({ paymentId, clientId, paymentDate, amount });
            }
          );
        }
      );
    });
  });
});

// Delete a client
app.delete("/clients/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM clients WHERE id = ?`, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).end();
  });
});

// Mark client check-in
app.post("/attendance/checkin", (req, res) => {
  const { clientId } = req.body;
  const id = uuidv4();
  const checkInTime = dayjs().format();

  db.run(
    `INSERT INTO attendance (id, clientId, checkInTime) VALUES (?, ?, ?)`,
    [id, clientId, checkInTime],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run(
        `UPDATE clients SET isCheckedIn = TRUE WHERE id = ?`,
        clientId,
        function (updateErr) {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.status(201).json({ id, clientId, checkInTime });
        }
      );
    }
  );
});

// Mark client check-out
app.post("/attendance/checkout", (req, res) => {
  const { clientId } = req.body;
  const checkOutTime = dayjs().format();

  db.run(
    `UPDATE attendance SET checkOutTime = ? WHERE clientId = ? AND checkOutTime IS NULL`,
    [checkOutTime, clientId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run(
        `UPDATE clients SET isCheckedIn = FALSE WHERE id = ?`,
        clientId,
        function (updateErr) {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.status(200).json({ clientId, checkOutTime });
        }
      );
    }
  );
});

// Get attendance records
app.get("/attendance", (req, res) => {
  db.all("SELECT * FROM attendance", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
