const express = require('express');
const app = express();
const port = 5501;

app.get("/", (req, res) => {
    res.send("Cell Towers API");
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))