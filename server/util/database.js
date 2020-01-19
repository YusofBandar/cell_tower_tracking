const { Pool } = require("pg");
let pool;

const connect = () => {
    pool = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT || 5432
      });
}

exports.connect = connect;