const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

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
    Envanter TEXT UNIQUE,
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

      res.send(theSqlList);
    }
  });
};

const deleteRecord = (req, res) => {
  const id = req.params.id;
  const value = req.params.value;
  console.log(typeof value);

  const sql_delete = `DELETE FROM infos WHERE id = ?`;

  db.run(sql_delete, id, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error deleting record.");
    } else {
      console.log("Record deleted successfully.");

      // ID sıralamasını güncelle
      if (value == "1") {
        const sql_update = `UPDATE infos SET id = id - 1 WHERE id > ?`;
        db.run(sql_update, id, (err) => {
          if (err) {
            console.error(err.message);
            res.status(500).send("Error updating .");
          } else {
            console.log("ID sequence .");
            res.send("Record deleted .");
          }
        });
      }
    }
  });
};

const updateIdValues = (req, res) => {
  const updateQuery = `
    WITH NewOrder AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS new_id
      FROM infos
    )
    UPDATE infos
    SET id = (SELECT new_id FROM NewOrder WHERE NewOrder.id = infos.id)`;

  db.run(updateQuery, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error.");
    } else {
      console.log("ID sequence updated successfully.");
      res.send("Successfully updated ID values.");
    }
  });
};

const updateRecord = (req, res) => {
  const {
    id,
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

  const sql_update = `UPDATE infos SET
    Site = ?,
    Tipi = ?,
    Numara = ?,
    Durum = ?,
    Envanter = ?,
    Ait = ?,
    Seri_No = ?,
    Marka_Model = ?,
    İşletim_Sistemi = ?,
    Lisans = ?
  WHERE ID = ?`;

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
    id, // The ID of the record to be updated
  ];

  db.run(sql_update, values, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error updating record.");
    } else {
      console.log("Record updated successfully.");
      res.send("Record updated successfully.");
    }
  });
};

createTable();

app.use("/", express.static("./js/public"));
//
app.post("/saveData", insertRecord);
app.get("/fetchRecords", fetchRecords);
app.delete("/deleteRecord/:id/:value", deleteRecord);
app.post("/updateData", updateRecord);
app.post("/updateIdValues", updateIdValues);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
