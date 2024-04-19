/* Create company_profile table if doesn't exist */
CREATE TABLE symbol (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20),
    company_name VARCHAR(100),
    currency VARCHAR(20),
    cik VARCHAR(100),
    isin VARCHAR(100),
    cusip VARCHAR(100),
    exchange VARCHAR(100),
    exchange_short_name VARCHAR(100),
    industry VARCHAR(100),
    website VARCHAR(200),
    "description" TEXT,
    ceo VARCHAR(100),
    sector VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(100),
    "address" VARCHAR(100),
    city VARCHAR(100),
    "state" VARCHAR(100),
    ipo_date DATE,
    is_etf BOOLEAN,
    is_actively_trading BOOLEAN,
    is_adr BOOLEAN,
    is_fund BOOLEAN
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
    adj_close DOUBLE PRECISION,
    volume INTEGER,
    unadjusted_volume INTEGER,
    change DOUBLE PRECISION,
    change_percent DOUBLE PRECISION,
    vwap REAL,
    label DATE,
    change_over_time DOUBLE PRECISION
);

/* Load data into symbol */
COPY symbol FROM '/Users/vtamprateep/Documents/GitHub/value-investing-research-platform/data_scripts/symbol.csv' DELIMITER ',' CSV HEADER;

/* Load data into charts */
COPY charts FROM '/Users/vtamprateep/Documents/GitHub/value-investing-research-platform/data/db_tables/charts/charts.csv' DELIMITER ',' CSV HEADER;