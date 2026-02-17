const request = require("supertest");
const app = require("../app");
const ingredient = require("../models/ingredient");
const rating = require("../models/rating");

describe("GET /api/recipes", () => {

    test("no parameters, return 200 with correct structure", async () => {
        const response = await request(app).get("/api/recipes");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);

        if (response.body.data.length > 0) {
            const recipe = response.body.data[0];
            expect(recipe).toHaveProperty("id_recipe");
            expect(recipe).toHaveProperty("name");
            expect(recipe).toHaveProperty("image_url");
            expect(recipe).toHaveProperty("matched_ingredients");
            expect(recipe).toHaveProperty("total_ingredients");
            expect(recipe).toHaveProperty("rating");
        }
    });
    test("limit parameter, data length less than or equal to limit", async () => {
        const response = await request(app).get("/api/recipes?limit=5");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(5);
    });
    test("limit>MAX_LIMIT parameter, should be 200", async () => {
        const response = await request(app).get("/api/recipes?limit=9999");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(200);
    });
    test("incorrect parameters, return 200 anyway with default behaviour", async () => {
        const response = await request(app).get("/api/recipes?limit=abc&sortBy=abc&ingredient=ab&ingredient=uu&ingredient=cc");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);

        if (response.body.data.length > 0) {
            const recipe = response.body.data[0];
            expect(recipe).toHaveProperty("id_recipe");
            expect(recipe).toHaveProperty("name");
            expect(recipe).toHaveProperty("image_url");
            expect(recipe).toHaveProperty("matched_ingredients")
        }
    });
    test("search by name", async () => {
        const response = await request(app).get("/api/recipes?search=12");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data.length > 0) {
            expect(response.body.data[0].name.toLowerCase()).toContain("12");
        }
    });
    test("search by ingredients", async () => {
        const response = await request(app).get("/api/recipes?ingredient=1&ingredient=2");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data.length > 0) {
            expect(response.body.data[0].matched_ingredients).toBeGreaterThanOrEqual(1);
        }
    });
});
describe("GET /api/recipe?id_recipe=xxx", () => {
    test("valid id_recipe, return 200 with correct structure", async () => {
        const response = await request(app).get("/api/recipes/recipe?id_recipe=1");
        expect(response.status).toBe(200);
        const recipe = response.body;
        expect(recipe).toMatchObject({
            status: "success",
            name: expect.any(String),
            id_recipe: 1,
            instructions: expect.any(String),
            ingredients: expect.any(Array),
            author: {
                id_user: expect.any(Number),
                username: expect.any(String),
            },
            rating: expect.any(Number),
        });
    });
    test("missing id_recipe, return 400", async () => {
        const response = await request(app).get("/api/recipes/recipe");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("status", "fail");
        expect(response.body).toHaveProperty("message", "Missing required fields");
    });
    test("recipe not found, return 404", async () => {
        const response = await request(app).get("/api/recipes/recipe?id_recipe=999999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("status", "fail");
        expect(response.body).toHaveProperty("message", "Recipe not found");
    });
    // no ratings rating=0
});