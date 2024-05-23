const express = require('express');
const pgPool = require("../../util/db");
const request = require("supertest");
const hierarchyRoutes = require("../../routes/hierarchy");

// Set up mocks & app
jest.mock("../../util/db");
jest.mock("pg");

const app = express();
app.get("/get_parent_ids/:symbol_id", hierarchyRoutes.getParentIds);
app.get("/get_child_ids/:parent_symbol_id", hierarchyRoutes.getChildIds);

// Unit tests
describe("GET /get_parent_ids/:symbol_id", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: ["Test"] });
        const response = await request(app).get("/get_parent_ids/513");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rows: ["Test"] })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app).get("/get_parent_ids/513");

        expect(response.status).toBe(500);
    })
})

describe("GET /get_child_ids/:symbol_id", () => {
    it("should give status 200 and return database result unmodified", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: ["Test"] });
        const response = await request(app).get("/get_child_ids/513");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rows: ["Test"] })
    });

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app).get("/get_child_ids/513");

        expect(response.status).toBe(500);
    })
})
