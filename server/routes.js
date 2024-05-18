const { Pool } = require('pg');
const config = require('./config.json');
require("dotenv").config();

// Create client and connect
const pgPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

/* Route to get daily charts data. Would be cool to increase / decrease granularity by week / month */
const getCharts = async function (req, res) {
    const pathParams = req.params;
    const queryParams = req.query;

    // Execute query and return
    pgPool.query(`
        SELECT
            symbol.symbol,
            close_date,
            adj_close
        FROM charts
            LEFT JOIN symbol ON charts.symbol_id = symbol.id
        WHERE symbol_id = $1
            AND close_date BETWEEN $2 AND $3
        ORDER BY 1, 2 ASC
    `, [pathParams.symbol_id, queryParams.start_date, queryParams.end_date])
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
};

/* Get latest daily price change */
const getLatestPriceChange = async function (req, res) {
    const queryParams = req.query;

    pgPool.query(`
        WITH cte_latest_adj_close AS (
            SELECT
                symbol.symbol,
                close_date,
                adj_close,
                ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY close_date DESC) AS rank
            FROM charts
                LEFT JOIN symbol ON charts.symbol_id = symbol.id
            WHERE symbol_id IN (SELECT UNNEST(STRING_TO_ARRAY($1, ','))::INT)
        )
        SELECT *
        FROM cte_latest_adj_close
        WHERE rank <= 2
    `, [queryParams.symbol_ids])
        .then(result => res.send(result))
        .catch(error => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        })
}

const getSymbolId = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            id
        FROM symbol
        WHERE symbol = $1
    `, [pathParams.symbol])
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

const getParentIds = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        WITH cte_parent_symbol_id AS (
            SELECT
                parent_symbol_ids
            FROM hierarchy
            WHERE symbol_id = $1
        )
        SELECT
            symbol_id,
            symbol,
            "type"
        FROM hierarchy
            LEFT JOIN symbol ON symbol.id = hierarchy.symbol_id
        WHERE symbol_id = ANY(SELECT UNNEST(parent_symbol_ids) FROM cte_parent_symbol_id)
            OR symbol_id = $2
    `, [pathParams.symbol_id, pathParams.symbol_id])
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
const getChildIds = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            symbol_id,
            type
        FROM hierarchy
        WHERE $1 = ANY(parent_symbol_ids)
        LIMIT 50
    `, [pathParams.parent_symbol_id])
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
        WHERE symbol_id = $1
            AND item = 'Diluted EPS'
        ORDER BY 4 DESC
        LIMIT 4
    `, [pathParams.symbol_id])
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
        WHERE id IN ($1)
    `, [queryParams.symbol_ids])
        .then((result) => res.send(result))
        .catch((error) => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

/**
 * Given a symbol ID, retrieve recent events highlights and citations
 * @param {*} req 
 * @param {*} res 
 */
const getSymbolHighlights = function(req, res) {
    const pathParams = req.params;

    pgPool.query(`
        SELECT
            highlights,
            documents,
            created_on::DATE
        FROM symbol_highlights
        WHERE symbol_id = $1
        ORDER BY 3 DESC
        LIMIT 1;
    `, [pathParams.symbol_id])
        .then(result => {res.send(result)})
        .catch(error => {
            console.error("Error executing query:", error);
            res.status(500).send("Internal Server Error.");
        });
}

module.exports = {
    getCharts,
    getSymbolId,
    getParentIds,
    getTTMDilutedEPS,
    getChildIds,
    getSymbolNames,
    getSymbolHighlights,
    getLatestPriceChange
}