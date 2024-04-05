const postgres = require('postgres');
const config = require('./config.json');


const connection = postgres({
    host: config.host,
    username: config.user,
    password: config.pass,
    port: config.port,
    database: config.db,
    multipleStatements : true
});

const test = function (req, res) {
    res.send('response from express backend received!');
}

module.exports = {
    test
}