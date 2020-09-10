const { Pool } = require("pg");
const conversion = require("./conversions");
let pool;

if(!process.env.USER) throw new Error('USER env variable not defined');
if(!process.env.HOSTthrow) new Error('HOST env variable not defined');
if(!process.env.DATABASE) throw new Error('DATABASE env variable not defined');
if(!process.env.PASSWORD) throw new Error('PASSWORD env variable not defined');

const connect = () => {
    pool = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT || 5432
      });
}

const getCellTowersInRange = async (lat, lng, range) => {
    const posOffset = conversion.offsetCoordsMetres(lat, lng, range, range);
    const negOffset = conversion.offsetCoordsMetres(lat, lng, -range, -range);
    const query = {
        text: `SELECT *
        FROM towers
        where lat > $1 and lat < $2 
        and lon > $3 and lon < $4;
        `,
        values: [negOffset[0],posOffset[0],negOffset[1],posOffset[1]]
    }

    const result = await pool.query(query);
    return result.rows;
}

exports.connect = connect;
exports.getCellTowersInRange = getCellTowersInRange;
