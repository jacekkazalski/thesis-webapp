const request = require("supertest");
const app = require("../app");
const ingredient = require("../models/ingredient");
const rating = require("../models/rating");
const {loginAndGetToken} = require("./helpers/auth")

describe("POST /api/recipes/create", () => {
    test("no token, return 401", async () => {
        const response = await request(app).post("/api/recipes/create")
        expect (response.status).toBe(401);
    })
    test("valid inputs, return")
});