const request = require("supertest");
const app = require("../app");
const { resetDatabase } = require("./helpers/setupDb");
const { loginAndGetToken } = require("./helpers/auth");
require("dotenv").config();

const user_1_email = process.env.TEST_USER_1;
const user_2_email = process.env.TEST_USER_2;
const user_1_password = process.env.TEST_USER_PASSWORD;
const mod_1_email = process.env.TEST_MOD_1;

describe("POST /api/auth/signup", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("signup with missing fields, code 400", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      username: "user",
      password: "password",
      confirmPassword: "password",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });
  test("passwords not matching, code 400", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      username: "user",
      password: "password",
      confirmPassword: "pasword",
      email: "user@gmail.com",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Passwords do not match");
  });
  test("password too short, code 400", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      username: "user",
      password: "passwor",
      confirmPassword: "passwor",
      email: "user@gmail.com",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Password must be at least 8 characters long",
    );
  });
  test("signup with valid inputs, code 201", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      username: "user_test",
      email: "user_test@gmail.com",
      password: "Test123!",
      confirmPassword: "Test123!",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body.data.user).toHaveProperty("id");
    expect(response.body.data.user).toHaveProperty("username", "user_test");
    expect(response.body.data.user).toHaveProperty(
      "email",
      "user_test@gmail.com",
    );
  });
});
describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("login valid credentials and refresh access token using http only cookie, code 200", async () => {
    const email = user_1_email;
    const password = user_1_password;
    const username = "user_1";

    const agent = request.agent(app);
    const response = await agent.post("/api/auth/login").send({
      email: email,
      password: password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("username", username);
    expect(response.body).toHaveProperty("email", email);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(
      response.headers["set-cookie"].some((c) => c.startsWith("jwt=")),
    ).toBe(true);

    const responseRefresh = await agent.get("/api/auth/refresh");
    expect(responseRefresh.status).toBe(200);
    expect(responseRefresh.body).toHaveProperty("accessToken");
  });
  test("invalid credentials, code 401", async () => {
    const email = "user_1@example.com";
    const password = "wrong";
    const username = "user_1";
    const response = await request(app).post("/api/auth/login").send({
      email: email,
      password: password,
    });
    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty("accessToken");
    expect(response.body).not.toHaveProperty("username", username);
    expect(response.body).not.toHaveProperty("email", email);
    expect(response.body.message).toBe("Invalid email or password");
  });
});
describe("POST /api/auth/change-password", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("incorrect password, code 401", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "wrong",
        newPassword: "Test123!",
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Current password is incorrect");
  });
  test("change password with valid inputs, code 200", async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: user_1_password,
        newPassword: user_1_password,
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password changed successfully");
  });
});
