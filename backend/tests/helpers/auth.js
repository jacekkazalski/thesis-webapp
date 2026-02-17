const request = require("supertest");
const app = require("../../app");

async function loginAndGetToken(email = "user_1@example.com", password = "Test123!") {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.accessToken;
}

module.exports = { loginAndGetToken };
