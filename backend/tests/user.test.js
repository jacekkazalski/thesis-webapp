const request = require("supertest");
const app = require("../app");
const { resetDatabase } = require("./helpers/setupDb");
const { loginAndGetToken } = require("./helpers/auth");

describe("DELETE /api/users", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("delete user with valid token, code 200", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .delete("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User and associated data deleted successfully");
  });
  test("delete user with invalid token, code 401", async () => {
    const response = await request(app)
      .delete("/api/users")
      .set("Authorization", `Bearer invalidtoken`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
