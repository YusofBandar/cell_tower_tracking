const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const cellTowerCSV = "./cell_towers_2020-01-13-T000000.csv";
fs.createReadStream(path.resolve(__dirname, "", cellTowerCSV))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));