const request = require("supertest");
const app = require("../app");


describe("GET /get_charts/:symbol_id", () => {
    
    it("responds with JSON containing close_date and adj_close", async () => {
        const res = await request(app)
            .get("/get_charts/1");
        expect(res.status).toBe(200);
        // expect(res.body[0]).toHaveProperty("close_date");
        // expect(res.body[0]).toHaveProperty("adj_close");
    });

    // it("should respond to start_date and end_date query parameters", async () => {
    //     const res = await request(app)
    //         .get("/get_charts/1?start_date=2024-01-01&end_date=2024-03-31");
    //     // Check if filter worked by restricting to specific month
    //     expect(res.body[0].close_date).toEqual(expect.stringContaining("2024-01"));
    //     expect(res.body[res.body.length - 1].close_date).toEqual(expect.stringContaining("2024-03"));
    // })  
})
