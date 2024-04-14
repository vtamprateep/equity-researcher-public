const request = require("supertest");
const app = require("../app");
const postgres = require("postgres");


describe("GET /get_charts/:symbol_id", () => {
    
    it("responds with JSON containing close_date and adj_close", async () => {
        const res = await request(app)
            .get("/get_charts/1");
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("close_date");
        expect(res.body[0]).toHaveProperty("adj_close");
    });

    // it("should respond to start_date and end_date query parameters", async () => {
    //     const res = await request(app)
    //         .get("/get_charts/1?start_date=2024-01-01&end_date=2024-03-01");
    //     expect(res.status).toBe(200);
    //     expect(res.body[0].close_date).toBeGreaterThanOrEqual("2024-01-01");
    //     expect(res.body[-1].close_date).toBeLessThanOrEqual("2024-03-01");
    // })  
})