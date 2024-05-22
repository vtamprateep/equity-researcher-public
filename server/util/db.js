const { Pool } = require('pg');
const config = require('../config.json');
require("dotenv").config();


const pgPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

module.exports = pgPool;