const express = require('express');
const pgPool = require("../../util/db");
const request = require("supertest");
const { CohereClient } = require("cohere-ai");
const highlightsRoutes = require("../../routes/highlights");

// Set up mocks & app
jest.mock("../../util/db");
jest.mock("pg");
jest.mock("cohere-ai");

const app = express();
app.get("/get_symbol_highlights/:symbol_id", highlightsRoutes.getSymbolHighlights);

// Unit tests
describe("GET /get_symbol_highlights/:symbol_id", () => {
    it("should should hit Cohere API if entry doesn't exist", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: [{
            id: 513,
            symbol: "Test",
            highlights: null,
            documents: null,
            created_on: null
        }]});
        CohereClient.mockImplementation(() => ({
            chat: jest.fn().mockResolvedValueOnce({
                text: "Cohere return value",
                documents: [{ url: "Url1" }, { url: "Url2" }]
            })
        }));

        const response = await request(app).get("/get_symbol_highlights/513");

        expect(response.status).toBe(200);
        expect(response.body.rows[0].highlights).toEqual("Cohere return value");
        expect(response.body.rows[0].documents).toEqual(["Url1", "Url2"]);
    });

    it("should should hit Cohere API if entry 7 or more days old", async () => {
        const staleDate = new Date()
        staleDate.setDate(staleDate.getDate() - 7);

        pgPool.query.mockResolvedValueOnce({ rows: [{
            id: 513,
            symbol: "Test",
            highlights: "Test",
            documents: ["Test1, Test2"],
            created_on: staleDate
        }]});
        CohereClient.mockImplementation(() => ({
            chat: jest.fn().mockResolvedValueOnce({
                text: "Cohere return value",
                documents: [{ url: "Url1" }, { url: "Url2" }]
            })
        }));
        const response = await request(app).get("/get_symbol_highlights/513");

        expect(response.status).toBe(200);
        expect(response.body.rows[0].highlights).toEqual("Cohere return value");
        expect(response.body.rows[0].documents).toEqual(["Url1", "Url2"]);
    })

    it("should not hit Cohere API if data exists and is recent", async () => {
        pgPool.query.mockResolvedValueOnce({ rows: [{
            id: 513,
            symbol: "Test",
            highlights: "Test",
            documents: ["Test1", "Test2"],
            created_on: new Date()
        }]});
        const response = await request(app).get("/get_symbol_highlights/513");

        expect(response.status).toBe(200);
        expect(response.body.rows[0].highlights).toEqual("Test");
        expect(response.body.rows[0].documents).toEqual(["Test1", "Test2"]);
    })

    it("should give status 500 on database error", async () => {
        pgPool.query.mockRejectedValueOnce(new Error('Database error'));
        const response = await request(app).get("/get_symbol_highlights/513");
        expect(response.status).toBe(500);
    })
})
