const { Pool } = require('pg');
const config = require('./config.json');
require("dotenv").config();

const { CohereClient } = require("cohere-ai");


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
                charts.symbol_id,
                symbol.symbol,
                close_date,
                adj_close,
                ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY close_date DESC) AS rank
            FROM charts
                LEFT JOIN symbol ON charts.symbol_id = symbol.id
            WHERE symbol_id IN (SELECT UNNEST(STRING_TO_ARRAY($1, ','))::INT)
        ),
        cte_adj_close_pivot AS (
            SELECT
              left_t.symbol_id,
              left_t.symbol,
              left_t.adj_close AS price_1,
              right_t.adj_close AS price_2
            FROM cte_latest_adj_close AS left_t
              LEFT JOIN cte_latest_adj_close AS right_t
                ON left_t.symbol_id = right_t.symbol_id
                  AND right_t.rank = 2
            WHERE left_t.rank = 1  
        )
        SELECT
            symbol_id,
            symbol,
            (price_1 - price_2) / price_2 AS day_pct_change
        FROM cte_adj_close_pivot
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
            id,
            symbol,
            hierarchy.type
        FROM symbol
            LEFT JOIN hierarchy
                ON hierarchy.symbol_id = symbol.id
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
    const queryParams = req.query;

    pgPool.query(`
        SELECT
            symbol_id,
            type
        FROM hierarchy
        WHERE $1 = ANY(parent_symbol_ids)
            AND type = $2
        LIMIT 50
    `, [pathParams.parent_symbol_id, queryParams.type])
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
            symbol.id,
            symbol.symbol,
            highlights,
            documents,
            created_on::DATE
        FROM symbol
            LEFT JOIN symbol_highlights
                ON symbol.id = symbol_highlights.symbol_id
        WHERE symbol.id = $1
        ORDER BY 3 DESC
        LIMIT 1;
    `, [pathParams.symbol_id])
        .then(result => {
            // Get entry and calculate age
            let entry = result.rows[0]
            let entryDayAge = 9999;
            
            if (entry.created_in !== null) {
                entryDayAge = (new Date().getTime() - entry.created_on.getTime()) / (1000 * 3600 * 24)
            }
            
            // No return value or 7+ days stale, call API and insert new record into database
            if (entry.highlights !== null && entryDayAge < 7) {
                res.send(result);
            } else {
                const cohere = new CohereClient({token: process.env.COHERE_API_KEY});
                cohere.chat({
                    message: `Give me a summary of public news / events within the past week relating to the stock symbol ${entry.symbol} that would influence a buy / sell decision`,
                    connectors: [{"id": "web-search"}]
                })
                    .then(highlight => {
                        let returnVal = {
                            highlights: highlight.text,
                            documents: highlight.documents.map(entry => entry.url),
                            created_on: new Date().toISOString()
                        }
                        res.send({rows: [returnVal]});

                        // Insert into database
                        pgPool.query(`
                            INSERT INTO symbol_highlights (symbol_id, highlights, documents)
                            VALUES ($1, $2, $3)
                        `, [entry.id, returnVal.highlights, returnVal.documents]);
                    })
            }
        })
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