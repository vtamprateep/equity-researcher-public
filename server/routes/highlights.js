const pgPool = require("../util/db.js");
const { CohereClient } = require("cohere-ai");


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
        ORDER BY 5 DESC
        LIMIT 1;
    `, [pathParams.symbol_id])
        .then(result => {
            // Get entry and calculate age
            let entry = result.rows[0]
            let entryDayAge = 9999;
            
            if (entry.created_on !== null) {
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
    getSymbolHighlights
}