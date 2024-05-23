const request = require("supertest");

// Mock all the actual route functions
const chartsRoutes = require("../routes/charts.js");
jest.mock("../routes/charts.js");
chartsRoutes.getCharts = jest.fn((req, res) => res.status(200).send());
chartsRoutes.getLatestPriceChange = jest.fn((req, res) => res.status(200).send());

const highlightsRoutes = require("../routes/highlights.js");
jest.mock("../routes/highlights.js");
highlightsRoutes.getSymbolHighlights = jest.fn((req, res) => res.status(200).send());

const hierarchyRoutes = require("../routes/hierarchy.js");
jest.mock("../routes/hierarchy.js");
hierarchyRoutes.getChildIds = jest.fn((req, res) => res.status(200).send());
hierarchyRoutes.getParentIds = jest.fn((req, res) => res.status(200).send());

const financialsRoutes = require("../routes/financials.js");
jest.mock("../routes/financials.js");
financialsRoutes.getTTMDilutedEPS = jest.fn((req, res) => res.status(200).send());

const symbolRoutes  = require("../routes/symbols.js");
jest.mock("../routes/symbols.js");
symbolRoutes.getSymbolId = jest.fn((req, res) => res.status(200).send());
symbolRoutes.getSymbolNames = jest.fn((req, res) => res.status(200).send());

const app = require("../app");

// Unit Tests
describe("Validate all server routes", () => {
    it("should have valid /get_charts/:symbol_id route", async () => {
        await request(app).get("/get_charts/513");
        expect(chartsRoutes.getCharts).toHaveBeenCalled();
    })

    it("should have valid /get_latest_price_change route", async () => {
        await request(app).get("/get_latest_price_change");
        expect(chartsRoutes.getLatestPriceChange).toHaveBeenCalled();
    })

    it("should have valid /get_symbol_highlights/:symbol_id route", async () => {
        await request(app).get("/get_symbol_highlights/513");
        expect(highlightsRoutes.getSymbolHighlights).toHaveBeenCalled();
    })

    it("should have valid /get_parent_ids/:symbol_id route", async () => {
        await request(app).get("/get_parent_ids/513");
        expect(hierarchyRoutes.getParentIds).toHaveBeenCalled();
    })

    it("should have valid /get_child_ids/:symbol_id route", async () => {
        await request(app).get("/get_child_ids/513");
        expect(hierarchyRoutes.getChildIds).toHaveBeenCalled();
    })

    it("should have valid /get_ttm_diluted_eps/:symbol_id route", async () => {
        await request(app).get("/get_ttm_diluted_eps/513");
        expect(financialsRoutes.getTTMDilutedEPS).toHaveBeenCalled();
    })

    it("should have valid /get_symbolid/:symbol route", async () => {
        await request(app).get("/get_symbolid/SPY");
        expect(symbolRoutes.getSymbolId).toHaveBeenCalled();
    })

    it("should have valid /get_symbol_names route", async () => {
        await request(app).get("/get_symbol_names?symbol_ids=513");
        expect(symbolRoutes.getSymbolNames).toHaveBeenCalled();  
    })
})
