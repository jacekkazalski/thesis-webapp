const request = require("supertest");
const app = require("../app");
const ingredient = require("../models/ingredient");
const rating = require("../models/rating");
const { loginAndGetToken } = require("./helpers/auth");
require("dotenv").config();

const user_1_email = process.env.TEST_USER_1;
const user_2_email = process.env.TEST_USER_2;
const user_1_password = process.env.TEST_USER_PASSWORD;
const mod_1_email = process.env.TEST_MOD_1;

describe("POST /api/recipes/create", () => {
  test("no token, return 401", async () => {
    const response = await request(app).post("/api/recipes/create");
    expect(response.status).toBe(401);
  });
  test("empty name, return 400", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .post("/api/recipes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "          ",
        instructions: "Test instructions",
        ingredients: [
          { id_ingredient: 1, name: "Wieprzowina", quantity: "2" },
          { id_ingredient: 3, name: "Marchewka", quantity: "3" },
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "fail");
    expect(response.body).toHaveProperty("message", "Missing required fields");
  });
  test("no ingredients, return 400", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .post("/api/recipes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Recipe",
        instructions: "Test instructions",
        ingredients: [],
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "fail");
    expect(response.body).toHaveProperty("message", "Missing required fields");
  });
  test("valid data, return 201", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .post("/api/recipes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Recipe",
        instructions: "Test instructions",
        ingredients: [
          { id_ingredient: 1, name: "Wieprzowina", quantity: "2" },
          { id_ingredient: 3, name: "Marchewka", quantity: "3" },
        ],
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id_recipe");
  });
});
describe("PUT /api/recipes/update", () => {
  test("no token, return 401", async () => {
    const response = await request(app).put("/api/recipes/update");
    expect(response.status).toBe(401);
  });
  test("empty name, return 400", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .put("/api/recipes/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_recipe: 1,
        name: "          ",
        instructions: "Updated instructions",
        ingredients: [
          { id_ingredient: 1, name: "Wieprzowina", quantity: "2" },
          { id_ingredient: 3, name: "Marchewka", quantity: "3" },
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("status", "fail");
    expect(response.body).toHaveProperty("message", "Missing required fields");
  });
  test("recipe belongs to another user, return 403", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .put("/api/recipes/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_recipe: 3,
        name: "Test Recipe",
        instructions: "Updated instructions",
        ingredients: [
          { id_ingredient: 1, name: "Wieprzowina", quantity: "2" },
          { id_ingredient: 3, name: "Marchewka", quantity: "3" },
        ],
      });
    expect(response.status).toBe(403);
  });
  test("valid data, return 200", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .put("/api/recipes/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id_recipe: 1,
        name: "Updated Test Recipe",
        instructions: "Updated instructions",
        ingredients: [
          { id_ingredient: 1, name: "Wieprzowina", quantity: "2" },
          { id_ingredient: 3, name: "Marchewka", quantity: "3" },
        ],
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("message", "Recipe updated successfully");
  });
});
