const request = require("supertest");
const app = require("../../app");
require("dotenv").config();


async function loginAndGetToken(
  email = process.env.TEST_USER_1,
  password = process.env.TEST_USER_PASSWORD,
) {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });
  return res.body.accessToken;
}

module.exports = { loginAndGetToken };
