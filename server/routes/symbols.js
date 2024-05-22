const pgPool = require("../util/db.js");


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
    getChildIds,
    getSymbolNames,
}