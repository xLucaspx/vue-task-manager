const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const app = require("../../server");

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
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
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
        method,
        headers,
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
        method,
        headers,
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
        method,
        headers,
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
        method,
        headers,
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
        method,
        headers,
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
        method,
        headers,
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
        method,
        headers,
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
        method,
        headers,
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
});