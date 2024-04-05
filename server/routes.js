const postgres = require('postgres');
const config = require('./config.json');


const psql = postgres({
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

/* Route to get daily charts data. Would be cool to increase / decrease granularity by week / month */
const get_charts = async function (req, res) {
    body_params = req.body;
    path_params = req.params;
    psql`
        SELECT
            close_date,
            open,
            high,
            low,
            close,
            adj_close,
            volume,
            unadjusted_volume,
            change,
            change_over_time,
            vwap
        FROM charts
        WHERE symbol_id = ${path_params.symbol_id}
            AND close_date BETWEEN ${path_params.start_date} AND ${path_params.end_date}
        ;
    `.then((result) => res.send(result));
}

module.exports = {
    test,
    get_charts
}