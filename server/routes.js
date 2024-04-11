const postgres = require('postgres');
const config = require('./config.json');
const { query } = require('express');


const psql = postgres({
    host: config.host,
    username: config.user,
    password: config.pass,
    port: config.port,
    database: config.db,
    multipleStatements : true
});

/* Route to get daily charts data. Would be cool to increase / decrease granularity by week / month */
const get_charts = async function (req, res) {
    const path_params = req.params;
    const query_params = req.query;

    // Set start / end date. Default 1 year lookback.
    let current_date = new Date();
    
    var end_date = current_date.toISOString().slice(0, 10);
    var start_date = new Date(
        current_date.getFullYear() - 1, 
        current_date.getMonth(), 
        current_date.getDate()
    ).toISOString().slice(0, 10);

    // If both query params provided, set start and end
    if (query_params && (query_params.start_date && query_params.end_date)) {
        end_date = query_params.end_date;
        start_date = query_params.start_date;
    }

    // Execute query and return
    psql`
    SELECT
        close_date,
        adj_close
    FROM charts
    WHERE symbol_id = ${path_params.symbol_id}
        AND close_date BETWEEN ${start_date} AND ${end_date}
    `.then((result) => res.send(result));
}

module.exports = {
    get_charts
}