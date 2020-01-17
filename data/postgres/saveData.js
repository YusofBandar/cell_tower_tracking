const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT || 5432
});

const cellTowerCSV = "../towers.csv";
fs.createReadStream(path.resolve(__dirname, "", cellTowerCSV))
  .pipe(csv.parse({ headers: true }))
  .on("error", error => console.error(error))
  .on("data", async tower => {
    try {
      await addTower(tower);
    } catch (error) {
      console.log("ERROR", error);
    }
  })
  .on("end", rowCount => {
    console.log(`Parsed ${rowCount} rows`);
    pool.end();
  });

const addTower = async function(tower) {
  console.log(tower);
  const query = {
    text: `INSERT INTO towers
    (radio, mcc, net, area, cell, unit, lon, lat, "range", samples, changeable, created, updated, averagesignal)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
    values: Object.keys(tower).map((k) => tower[k]).filter((k) => k !== "")
  };

  // callback
  await pool.query(query);
};
