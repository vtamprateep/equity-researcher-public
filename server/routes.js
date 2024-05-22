const pgPool = require("./util/db.js");
const { CohereClient } = require("cohere-ai");


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

module.exports = {
    getSymbolId,
    getParentIds,
    getTTMDilutedEPS,
    getChildIds,
    getSymbolNames,
}