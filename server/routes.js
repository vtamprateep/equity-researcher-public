const { Pool } = require('pg');
const config = require('./config.json');

const STOCK_ID_RESTRICTION = 

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
            symbol.symbol,
            close_date,
            adj_close
        FROM charts
            LEFT JOIN symbol ON charts.symbol_id = symbol.id
        WHERE symbol_id = ${pathParams.symbol_id}
            AND close_date BETWEEN '${startDate}' AND '${endDate}'
        ORDER BY 1
    `)
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
};

const getSymbolId = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            id
        FROM symbol
        WHERE symbol = '${pathParams.symbol}'
    `)
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

const getParentId = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            parent_symbol_id
        FROM hierarchy
        WHERE symbol_id = ${pathParams.symbol_id}
    `)
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

/**
 * Return children symbol IDs based on hierarchy table.
 * @param {*} req 
 * @param {*} res 
 */
const getChildId = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            symbol_id,
            type
        FROM hierarchy
        WHERE parent_symbol_id = ${pathParams.parent_symbol_id}
    `)
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

/**
 * Return financial line items from database `financials` table
 * Path Params: symbol_id
 * @param {*} req 
 * @param {*} res 
 */
const getTTMDilutedEPS = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            symbol.symbol,
            item,
            value, 
            quarter_ending_on
        FROM financials
            LEFT JOIN symbol 
                ON financials.symbol_id = symbol.id
        WHERE symbol_id = ${pathParams.symbol_id}
            AND item = 'Diluted EPS'
        ORDER BY 4 DESC
        LIMIT 4
    `)
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

/**
 * Takes in query param `symbol_ids`, comma separated, return symbol ID and respective symbol names
 * @param {*} req 
 * @param {*} res 
 */
const getSymbolNames = function(req, res) {
    const queryParams = req.query;

    pgPool.query(`
        SELECT
            id,
            symbol
        FROM symbol
        WHERE id IN (${queryParams.symbol_ids})
    `)
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

module.exports = {
    getCharts,
    getSymbolId,
    getParentId,
    getTTMDilutedEPS,
    getChildId,
    getSymbolNames
}