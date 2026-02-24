const request = require("supertest");
const app = require("../app");
const { resetDatabase } = require("./helpers/setupDb");
const { loginAndGetToken } = require("./helpers/auth");
require("dotenv").config();

describe("GET /api/recipes", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("no parameters, return 200 with correct structure", async () => {
    const response = await request(app).get("/api/recipes");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);

    const recipe = response.body.data[0];
    expect(recipe).toHaveProperty("id_recipe");
    expect(recipe).toHaveProperty("name");
    expect(recipe).toHaveProperty("image_url");
    expect(recipe).toHaveProperty("matched_ingredients");
    expect(recipe).toHaveProperty("total_ingredients");
    expect(recipe).toHaveProperty("rating");
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
    const response = await request(app).get(
      "/api/recipes?limit=abc&sortBy=abc&ingredient=ab&ingredient=uu&ingredient=cc",
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);

    const recipe = response.body.data[0];
    expect(recipe).toHaveProperty("id_recipe");
    expect(recipe).toHaveProperty("name");
    expect(recipe).toHaveProperty("image_url");
    expect(recipe).toHaveProperty("matched_ingredients");
  });
  test("search by name", async () => {
    const response = await request(app).get("/api/recipes?search=Recipe_1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);

    expect(response.body.data[0].name.toLowerCase()).toContain("recipe_1");
  });
  test("search by ingredients", async () => {
    const response = await request(app).get(
      "/api/recipes?ingredient=1&ingredient=2",
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);

    const recipeArray = response.body.data;
    for (x = 0; x < recipeArray.length - 1; x++) {
      expect(recipeArray[x].matched_ingredients).toBeGreaterThanOrEqual(
        recipeArray[x + 1].matched_ingredients,
      );
    }
  });
});
describe("GET /api/recipe?id_recipe=xxx", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
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
    const response = await request(app).get(
      "/api/recipes/recipe?id_recipe=999999",
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("status", "fail");
    expect(response.body).toHaveProperty("message", "Recipe not found");
  });
});

describe("GET /api/recipes logged-in", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("test excluded ingredients, login as user_2 who has excluded ingredient 7", async () => {
    const token = await loginAndGetToken(
      process.env.TEST_USER_2,
      process.env.TEST_USER_PASSWORD,
    );
    const response = await request(app)
      .get("/api/recipes?useDiet=1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    for (const recipe of response.body.data) {
      expect(recipe.id_recipe).not.toBe(4);
    }
  });
  test("test diet, login as user_2 who has vegetarian diet", async () => {
    const token = await loginAndGetToken(
      process.env.TEST_USER_2,
      process.env.TEST_USER_PASSWORD,
    );
    const response = await request(app)
      .get("/api/recipes?useDiet=1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    for (const recipe of response.body.data) {
      expect(recipe.id_recipe).not.toBe(1);
    }
  });
  test("test included ingredients, login as user_1 who has ingredient 1 and 2, expect the matched ingredients to be more than 0", async () => {
    const token = await loginAndGetToken(
      process.env.TEST_USER_1,
      process.env.TEST_USER_PASSWORD,
    );
    const response = await request(app)
      .get("/api/recipes?useSaved=1&sortBy=ingredients")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    const firstRecipe = response.body.data[0];
    expect(firstRecipe.matched_ingredients).toBeGreaterThan(0);
  });
});
