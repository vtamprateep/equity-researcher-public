const pgPool = require("../util/db.js");


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

module.exports = {
    getParentIds,
    getChildIds
}