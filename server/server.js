const express = require("express");
const app = express();
const port = 5501;
const db = require("./util/database");


db.connect();


app.get("/", (req, res) => {
  res.send("Cell Towers API");
});

app.get("/towers", async (req, res) => {
  const query = req.query;
  if (!("lat" in query)) {
    res.statusMessage = "Missing lat query param"
    res.status(400).end();
    return;
  }
  if(!("lng" in query)){
    res.statusMessage = "Missing long query param"
    res.status(400).end();
    return;
  }

  const range = 8000;
  try {
    res.send(await db.getCellTowersInRange(Number(query.lat),Number(query.lng),range));    
  } catch (error) {
      res.statusMessage = "Internal error"
      res.status(500).end();
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
