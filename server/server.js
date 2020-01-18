const express = require("express");
const app = express();
const port = 5501;

app.get("/", (req, res) => {
  res.send("Cell Towers API");
});

app.get("/towers", (req, res) => {
  const query = req.query;
  if (!("lat" in query)) {
    res.statusMessage = "Missing lat query param"
    res.status(400).end();
    return;
  }
  if(!("long" in query)){
    res.statusMessage = "Missing long query param"
    res.status(400).end();
    return;
  }
  
  res.send("getting towers");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
