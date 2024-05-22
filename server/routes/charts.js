// This file contains routes that relate to the price of a stock
const pgPool = require("../util/db.js");


/* Route to get daily charts data. */
const getCharts = async function (req, res) {
    const pathParams = req.params;
    const queryParams = req.query;

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

module.exports = {
    getCharts,
    getLatestPriceChange
}