const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new sqlite3.Database(
  "./js/database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to the database.");
  }
);

const createTable = () => {
  const sql_create = `CREATE TABLE IF NOT EXISTS infos (
    id INTEGER PRIMARY KEY,
    Site TEXT,
    Tipi TEXT,
    Numara TEXT,
    Durum TEXT,
    Envanter TEXT,
    Ait TEXT,
    Seri_No TEXT,
    Marka_Model TEXT,
    İşletim_Sistemi TEXT,
    Lisans TEXT
  )`;

  db.run(sql_create, (err) => {
    if (err) return console.error(err.message);
    console.log("Table created or already exists.");
  });
};

const insertRecord = (req, res) => {
  const {
    site,
    grup,
    numara,
    durum,
    envanter,
    ait,
    "seri-no": seriNo,
    "marka-model": markaModel,
    "isletim-sistemi": isletimSistemi,
    lisans,
  } = req.body;

  const sql_insert = `INSERT INTO infos (
    Site,
    Tipi,
    Numara,
    Durum,
    Envanter,
    Ait,
    Seri_No,
    Marka_Model,
    İşletim_Sistemi,
    Lisans
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    site,
    grup,
    numara,
    durum,
    envanter,
    ait,
    seriNo,
    markaModel,
    isletimSistemi,
    lisans,
  ];

  db.run(sql_insert, values, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error inserting record.");
    } else {
      console.log("Record inserted successfully.");
      res.send("Record inserted successfully.");
    }
  });
};

const fetchRecords = (req, res) => {
  const sql_query = `SELECT * FROM infos`;

  db.all(sql_query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error fetching records.");
    } else {
      const theSqlList = [];

      rows.forEach((row) => {
        const sqlClass1 = {
          id: row.id,
          site: row.Site,
          type: row.Tipi,
          number: row.Numara,
          statu: row.Durum,
          inventory: row.Envanter,
          whose: row.Ait,
          serialNum: row.Seri_No,
          brand_model: row.Marka_Model,
          operatingSys: row.İşletim_Sistemi,
          licence: row.Lisans,
        };

        theSqlList.push(sqlClass1);
      });

      console.log(theSqlList);
      res.send(theSqlList);
    }
  });
};

createTable();

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.post("/saveData", insertRecord);
app.get("/fetchRecords", fetchRecords);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
