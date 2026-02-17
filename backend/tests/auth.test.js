const request = require("supertest");
const app = require("../app");
const {loginAndGetToken} = require("./helpers/auth")

describe("POST /api/auth/signup", () => {
    test("signup with missing fields, code 400", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "user",
                password: "password",
                confirmPassword: "password"
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required fields")

    })
    test("passwords not matching, code 400", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "user",
                password: "password",
                confirmPassword: "pasword",
                email: "user@gmail.com"
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Passwords do not match")

    })
    test("password too short, code 400", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "user",
                password: "passwor",
                confirmPassword: "passwor",
                email: "user@gmail.com"
            })
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Password must be at least 8 characters long")

    })
})
describe("POST /api/auth/login", () => {
    test("login valid credentials and refresh access token using http only cookie, code 200", async () => {
        const email = "user_1@example.com"
        const password = "Test123!"
        const username = "user_1"

        const agent = request.agent(app)
        const response = await agent
            .post("/api/auth/login")
            .send({
                email: email,
                password: password
            })
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken")
        expect(response.body).toHaveProperty("username", username)
        expect(response.body).toHaveProperty("email", email)
        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers["set-cookie"].some((c) => c.startsWith("jwt="))).toBe(true);

        const responseRefresh = await agent.get("/api/auth/refresh")
        expect(responseRefresh.status).toBe(200);
        expect(responseRefresh.body).toHaveProperty("accessToken")

    })
    test("invalid credentials, code 401", async () => {
        const email = "user_1@example.com"
        const password = "wrong"
        const username = "user_1"
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: email,
                password: password
            })
        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty("accessToken")
        expect(response.body).not.toHaveProperty("username", username)
        expect(response.body).not.toHaveProperty("email", email)
        expect(response.body.message).toBe("Invalid email or password")

    })
})
describe("POST /api/auth/change-password", () => {
    test("incorrect password, code 401", async () => {
        const token = await loginAndGetToken()
        const response = await request(app)
            .post("/api/auth/change-password")
            .set("Authorization", `Bearer ${token}`)
            .send({
                currentPassword: "wrong",
                newPassword: "Test123!"
            })
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Current password is incorrect")
    })
    test("change password with valid inputs, code 200", async () =>{
        const token = await loginAndGetToken()
        const response = await request(app)
            .post("/api/auth/change-password")
            .set("Authorization", `Bearer ${token}`)
            .send({
                currentPassword: "Test123!",
                newPassword: "Test123!"
            })
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Password changed successfully")
    })
})