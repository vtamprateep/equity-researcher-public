/* Create symbols table if doesn't exist */
DROP TABLE IF EXISTS symbol;
CREATE TABLE symbol (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20)
);

/* Create charts table if doesn't exist */
DROP TABLE IF EXISTS charts;
CREATE TABLE charts (
    id SERIAL PRIMARY KEY,
    symbol_id INTEGER REFERENCES symbol(id),
    close_date DATE,
    "open" DOUBLE PRECISION,
    high DOUBLE PRECISION,
    low DOUBLE PRECISION,
    "close" DOUBLE PRECISION,
    adj_close DOUBLE PRECISION
);

/* Create holdings table if doesn't exist */
DROP TABLE IF EXISTS holdings;
CREATE TABLE holdings (
    holding_symbol_id INTEGER REFERENCES symbol(id),
    symbol_id INTEGER REFERENCES symbol(id)
);

/* Create hierarchy table if doesn't exist */
DROP TABLE IF EXISTS hierarchy;
CREATE TABLE hierarchy (
    symbol_id INTEGER REFERENCES symbol(id),
    "type" VARCHAR(20),
    parent_symbol_id INTEGER REFERENCES symbol(id)
);

/* Create financials table if doesn't exist */
DROP TABLE IF EXISTS financials;
CREATE TABLE financials (
    symbol_id INTEGER REFERENCES symbol(id),
    item VARCHAR(20),
    "value" DECIMAL(15, 2),
    quarter_ending_on DATE
);

/* Load data into symbol */
COPY symbol FROM '/Users/vtamprateep/Documents/GitHub/value-investing-research-platform/data_scripts/symbol.csv' DELIMITER ',' CSV HEADER;

/* Load data into charts */
COPY charts FROM '/Users/vtamprateep/Documents/GitHub/value-investing-research-platform/data//charts/charts.csv' DELIMITER ',' CSV HEADER;