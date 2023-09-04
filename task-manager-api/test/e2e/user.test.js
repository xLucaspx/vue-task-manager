const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const app = require("../../server");
const { verifyJwt } = require("../../utils/jwt");
const getToken = require("./getToken");

describe("Task Manager API E2E Test Suite - Users", () => {
  let BASE_URL = "";
  let _server = {};

  before(async () => {
    if (process.env.NODE_ENV !== "test")
      throw new Error(
        `Tests should run in the test environment!
        \nCurrent environment: ${process.env.NODE_ENV || "development"}`
      );

    _server = app.listen();
    await new Promise((resolve, reject) => {
      _server.once("listening", () => {
        const { port } = _server.address();
        BASE_URL = `http://localhost:${port}`;
        console.log(`Test server running on ${BASE_URL}`);
        resolve();
      });
    });
  });

  after((done) => _server.close(done));

  describe("POST /user", () => {
    const user = {
      id: 4,
      name: "Test user",
      username: "test-user",
      email: "testuser@email.com",
      password: "#testUser01",
    };

    it("should return 400 (bad request) with an invalid username", async () => {
      const body = Object.assign({}, user, { username: "" });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The value "${body.username}" is not a valid username!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid email", async () => {
      const body = Object.assign({}, user, { email: "user@email" });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The value "${body.email}" is not a valid e-mail address!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid name", async () => {
      const body = Object.assign({}, user, { name: null });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The value "${body.name}" does not match the name requirements!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid password", async () => {
      const body = Object.assign({}, user, { password: "123" });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: "Password doesn't meet the minimum requirements!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 409 (conflict) with an id that's already regitered", async () => {
      const body = Object.assign({}, user, { id: 1 });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 409;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: `The ID ${body.id} is already registered!` };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 409 (conflict) with an username that's already regitered", async () => {
      const body = Object.assign({}, user, { username: "betty01" });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 409;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The username ${body.username} is already registered!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 409 (conflict) with an email that's already regitered", async () => {
      const body = Object.assign({}, user, { email: "john@email.com" });

      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 409;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The email ${body.email} is already registered!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 201 (created) and the registered user", async () => {
      const res = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const expected = 201;
      assert.strictEqual(
        res.status,
        expected,
        `Status should be: ${expected}. Actual: ${res.status}`
      );

      const actual = await res.json();
      assert.ok(actual, `Should've returned the registered user`);
    });
  });

  describe("POST /user/login", () => {
    const user = {
      user: "test-user",
      password: "#testUser01",
    };

    it("should return 401 (unauthorized) with correct username and incorrect password", async () => {
      const body = Object.assign({}, user, { password: "123" });

      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Incorrect password!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with correct email and incorrect password", async () => {
      const body = Object.assign({}, user, {
        user: "testuser@email.com",
        password: "123",
      });

      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Incorrect password!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 404 (not found) with an username that's not registered", async () => {
      const body = Object.assign({}, user, { user: "newuser" });

      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 404;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "User not found!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 404 (not found) with an email that's not registered", async () => {
      const body = Object.assign({}, user, { user: "invalid@email.com" });

      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      {
        const expected = 404;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "User not found!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and the access token with correct username and password", async () => {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const expected = 200;
      assert.strictEqual(
        res.status,
        expected,
        `Status should be: ${expected}. Actual: ${res.status}`
      );

      const token = await res.json();
      verifyJwt(token);
    });

    it("should return 200 (ok) and the access token with correct email and password", async () => {
      const body = Object.assign({}, user, { user: "testuser@email.com" });

      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const expected = 200;
      assert.strictEqual(
        res.status,
        expected,
        `Status should be: ${expected}. Actual: ${res.status}`
      );

      const token = await res.json();
      verifyJwt(token);
    });
  });

  describe("POST /user/auth", () => {
    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/user/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with invalid/malformed access token", async () => {
      const res = await fetch(`${BASE_URL}/user/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer json.web.token",
        },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and payload when passed a valid token", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/user/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      {
        const expected = 200;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = verifyJwt(token);
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Should've returned token payload. Returned: ${actual}`
        );
      }
    });
  });

  describe("PUT /user/:id", () => {
    const user = {
      id: 4,
      name: "Updated Test user",
      username: "fresh-test",
      email: "test@newmail.com",
      password: "#newPassword01",
    };

    it("should return 400 (bad request) with an invalid username", async () => {
      const body = Object.assign({}, user, { username: "" });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The value "${body.username}" is not a valid username!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid email", async () => {
      const body = Object.assign({}, user, { email: "user@email" });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The value "${body.email}" is not a valid e-mail address!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid name", async () => {
      const body = Object.assign({}, user, { name: null });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The value "${body.name}" does not match the name requirements!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid password", async () => {
      const body = Object.assign({}, user, { password: "123" });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 400;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: "Password doesn't meet the minimum requirements!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with invalid/malformed access token", async () => {
      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer json.web.token",
        },
        body: JSON.stringify(user),
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with another user's token", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: "It's not possible to modify other users' information!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) when trying to modify the user's id", async () => {
      const body = Object.assign({}, user, { id: 1 });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "It's not allowed to alter the user's ID!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 409 (conflict) with an username that's already regitered", async () => {
      const body = Object.assign({}, user, { username: "betty01" });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 409;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The username ${body.username} is already registered!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 409 (conflict) with an email that's already regitered", async () => {
      const body = Object.assign({}, user, { email: "john@email.com" });
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      {
        const expected = 409;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: `The email ${body.email} is already registered!`,
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and the updated user", async () => {
      const token = await getToken(BASE_URL, {
        user: "test-user",
        password: "#testUser01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const expected = 200;
      assert.strictEqual(
        res.status,
        expected,
        `Status should be: ${expected}. Actual: ${res.status}`
      );

      const actual = await res.json();
      assert.ok(actual, `Should've returned the registered user`);
    });
  });

  describe("GET /user/:id", () => {
    const user = {
      id: 4,
      name: "Updated Test user",
      email: "test@newmail.com",
      username: "fresh-test",
      Tasks: [],
    };

    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with invalid/malformed access token", async () => {
      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer json.web.token",
        },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with another user's token", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: "It's not possible to fetch information from other users!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and user info when passed valid access token", async () => {
      const token = await getToken(BASE_URL, {
        user: user.email,
        password: "#newPassword01",
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      {
        const expected = 200;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = user;
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Should've returned user info. Returned: ${actual}`
        );
      }
    });
  });

  describe("DELETE /user/:id", () => {
    const user = {
      id: 4,
      username: "fresh-test",
      password: "#newPassword01",
    };

    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with invalid/malformed access token", async () => {
      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer json.web.token",
        },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = { error: "Invalid access token!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with another user's token", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      {
        const expected = 401;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );
      }
      {
        const expected = {
          error: "It's not possible to delete other users' accounts!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 204 (no content) when user is successfully deleted", async () => {
      const token = await getToken(BASE_URL, {
        user: user.username,
        password: user.password,
      });

      const res = await fetch(`${BASE_URL}/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const expected = 204;
      assert.strictEqual(
        res.status,
        expected,
        `Status should be: ${expected}. Actual: ${res.status}`
      );
    });
  });
});
