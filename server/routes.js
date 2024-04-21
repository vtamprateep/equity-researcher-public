const { Pool } = require('pg');
const config = require('./config.json');


// Create client and connect
const pgPool = new Pool({
    host: config.host,
    user: config.user,
    password: config.pass,
    port: config.port,
    database: config.db
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
    pgPool.query(`
        SELECT
            close_date,
            adj_close
        FROM charts
        WHERE symbol_id = ${pathParams.symbol_id}
            AND close_date BETWEEN '${startDate}' AND '${endDate}'
        ORDER BY 1
    `).then((result) => res.send(result));
};

const getSymbolId = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            id
        FROM symbol
        WHERE symbol = '${pathParams.symbol}'
    `).then((result) => res.send(result));
}

const getParentId = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            parent_symbol_id
        FROM hierarchy
        WHERE symbol_id = ${pathParams.symbol_id}
    `).then((result) => res.send(result));
}

module.exports = {
    getCharts,
    getSymbolId,
    getParentId
}