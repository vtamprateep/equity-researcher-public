const express = require('express');
const pgPool = require("../../util/db");
const request = require("supertest");
const chartsRoute = require("../../routes/charts");

// Set up mocks & app
jest.mock("../../util/db");
jest.mock("pg");

const app = express();
app.get('/get_charts/:symbol_id', chartsRoute.getCharts);
app.get('/get_latest_price_change', chartsRoute.getLatestPriceChange);

describe("GET /get_charts/:symbol_id", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({
            rows: [
                { symbol: 'AAPL', close_date: '2024-01-01', adj_close: 150 },
                { symbol: 'AAPL', close_date: '2024-01-02', adj_close: 155 }
            ]
        });
        

        const response = await request(app)
            .get("/get_charts/513?start_date=2024-01-01&end_date=2024-03-31");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            rows: [
                { symbol: 'AAPL', close_date: '2024-01-01', adj_close: 150 },
                { symbol: 'AAPL', close_date: '2024-01-02', adj_close: 155 }
            ]
        })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app)
            .get("/get_charts/513");

        expect(response.status).toBe(500);
    })
})

describe("GET /get_latest_price_change", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({
            rows: [{ 
                symbol: 513,
                symbol: "SPY",
                day_pct_change: 0.1
            }]
        });

        const response = await request(app)
            .get("/get_latest_price_change?symbol_ids=513");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            rows: [{ 
                symbol: 513,
                symbol: "SPY",
                day_pct_change: 0.1
            }]
        })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app)
            .get("/get_latest_price_change?symbol_ids=ABC");

        expect(response.status).toBe(500);
    })
})
