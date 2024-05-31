import { ServerRoutes } from "../../util/server";


beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({ rows: 100 }), 
    })) as jest.Mock
});

describe("getCharts", () => {
    it("should default to 1 year period", () => {
        ServerRoutes.getCharts(513);
        
        // Define expected start / end dates
        const endDate = new Date();
        const startDate = new Date()
        startDate.setFullYear(endDate.getFullYear() - 1);

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg = global.fetch.mock.calls[0][0]
        const expectedUrlSegment = `start_date=${startDate.toISOString().slice(0,10)}&end_date=${endDate.toISOString().slice(0,10)}`
        expect(fetchUrlArg).toContain(expectedUrlSegment);
    });

    it("should correctly input date objects into request URL", () => {
        const endDate = new Date(2014, 11, 11);
        const startDate = new Date(2014, 10, 10);
        ServerRoutes.getCharts(513, startDate, endDate);

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg = global.fetch.mock.calls[0][0]
        const expectedUrlSegment = `start_date=${startDate.toISOString().slice(0,10)}&end_date=${endDate.toISOString().slice(0,10)}`
        expect(fetchUrlArg).toContain(expectedUrlSegment);
    });
});

describe("getSymbolId", () => {
    it("should cast symbol to upper case into request URL", () => {
        ServerRoutes.getSymbolId("spy");

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg = global.fetch.mock.calls[0][0];
        expect(fetchUrlArg).toContain("get_symbolid/SPY");
    });
});

describe("getParentIds", () => {
    it("should form the correct request URL", () => {
        ServerRoutes.getParentIds(513);

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg = global.fetch.mock.calls[0][0];
        expect(fetchUrlArg).toContain("get_parent_ids/513");
    });
});

describe("getChildIds", () => {
    it("should form the correct request URL", () => {
        ServerRoutes.getChildIds(513, "MARKET");

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg = global.fetch.mock.calls[0][0];
        expect(fetchUrlArg).toContain("get_child_ids/513?type=MARKET");
    });
});

describe("getSymbolNames", () => {
    it("should form the correct request URL", () => {
        ServerRoutes.getSymbolNames([513]);
        ServerRoutes.getSymbolNames([513,512]);

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg1 = global.fetch.mock.calls[0][0];
        expect(fetchUrlArg1).toContain("get_symbol_names?symbol_ids=513");

        // @ts-ignore
        const fetchUrlArg2 = global.fetch.mock.calls[1][0];
        expect(fetchUrlArg2).toContain("get_symbol_names?symbol_ids=513,512");
    });
});

describe("getSymbolHighlights", () => {
    it("should form the correct request URL", () => {
        const controller = new AbortController()
        ServerRoutes.getSymbolHighlights(513, controller.signal);

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg1 = global.fetch.mock.calls[0][0];
        expect(fetchUrlArg1).toContain("get_symbol_highlights/513");
    });
});

describe("getLatestPriceChange", () => {
    it("should form the correct request URL", () => {
        ServerRoutes.getLatestPriceChange([513]);
        ServerRoutes.getLatestPriceChange([513,512]);

        expect(global.fetch).toHaveBeenCalled();
        // @ts-ignore
        const fetchUrlArg1 = global.fetch.mock.calls[0][0];
        expect(fetchUrlArg1).toContain("get_latest_price_change/?symbol_ids=513");

        // @ts-ignore
        const fetchUrlArg2 = global.fetch.mock.calls[1][0];
        expect(fetchUrlArg2).toContain("get_latest_price_change/?symbol_ids=513,512");
    });
})