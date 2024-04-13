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
const getCharts = async function (req, res) {
    const pathParams = req.params;
    const queryParams = req.query;

    // Set start / end date. Default 1 year lookback.
    let currentDate = new Date();
    
    var endDate = currentDate.toISOString().slice(0, 10);
    var startDate = new Date(
        currentDate.getFullYear() - 1, 
        currentDate.getMonth(), 
        currentDate.getDate()
    ).toISOString().slice(0, 10);

    // If both query params provided, set start and end
    if (queryParams && (queryParams.start_date && queryParams.end_date)) {
        endDate = queryParams.end_date;
        startDate = queryParams.start_date;
    }

    // Execute query and return
    psql`
        SELECT
            close_date,
            adj_close
        FROM charts
        WHERE symbol_id = ${pathParams.symbol_id}
            AND close_date BETWEEN ${startDate} AND ${endDate}
    `.then((result) => res.send(result));
};

module.exports = {
    getCharts
}