const express = require('express');
const pgPool = require("../../util/db");
const request = require("supertest");
const symbolsRoutes = require("../../routes/symbols");

// Set up mocks & app
jest.mock("../../util/db");
jest.mock("pg");

const app = express();
app.get("/get_symbolid/:symbol", symbolsRoutes.getSymbolId);
app.get("/get_symbol_names", symbolsRoutes.getSymbolNames);

// Unit tests
describe("GET /get_symbolid/:symbol", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: ["Test"] });
        const response = await request(app).get("/get_symbolid/SPY");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rows: ["Test"] })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app).get("/get_symbolid/SPY");

        expect(response.status).toBe(500);
    })
})

describe("GET /get_symbol_names", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: ["Test"] });
        const response = await request(app).get("/get_symbol_names?symbol_ids=513");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rows: ["Test"] })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app).get("/get_symbol_names?symbol_ids=513");

        expect(response.status).toBe(500);
    })
})
