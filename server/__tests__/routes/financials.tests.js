const express = require('express');
const pgPool = require("../../util/db");
const request = require("supertest");
const financialsRoute = require("../../routes/financials");

// Set up mocks & app
jest.mock("../../util/db");
jest.mock("pg");

const app = express();
app.get("/get_ttm_diluted_eps/:symbol_id", financialsRoute.getTTMDilutedEPS);

// Unit tests
describe("GET /get_ttm_diluted_eps/:symbol_id", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: ["Test"] });
        const response = await request(app).get("/get_ttm_diluted_eps/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rows: ["Test"] })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app).get("/get_ttm_diluted_eps/1");

        expect(response.status).toBe(500);
    })
})
