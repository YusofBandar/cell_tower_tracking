const express = require('express');
const cors = require('cors');
const app = express();
const port = 5501;
const db = require('./util/database');


db.connect();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Cell Towers API');
});

app.get('/towers', async (req, res) => {
    const query = req.query;
    if (!('lat' in query)) {
        res.statusMessage = 'Missing lat query param'
        res.status(400).end();
        return;
    }
    if(!('lng' in query)){
        res.statusMessage = 'Missing long query param'
        res.status(400).end();
        return;
    }
    if(!('range' in query)){
        res.statusMessage = 'Missing range query param'
        res.status(400).end();
        return;
    }

    try {
        res.send(await db.getCellTowersInRange(Number(query.lat),Number(query.lng),Number(query.range)));    
    } catch (error) {
        res.statusMessage = 'Internal error'
        res.status(500).end();
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
