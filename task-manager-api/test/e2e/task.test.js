const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const getToken = require("./getToken");
const app = require("../../server");

describe("Task Manager API E2E Test Suite - Tasks", () => {
  let BASE_URL = "";
  let _server = {};
  const TEST_USER = {
    id: 5,
    name: "Task Test User",
    username: "task-test-user",
    email: "testuser@task.com",
    password: "#testUser01",
  };

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

    await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });
  });

  after(async (done) => {
    const token = await getToken(BASE_URL, {
      user: TEST_USER.username,
      password: TEST_USER.password,
    });

    await fetch(`${BASE_URL}/user/${TEST_USER.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    _server.close(done);
  });

  describe("POST /tasks", () => {
    const task = {
      id: 7,
      description: "Test the POST /tasks route",
      completed: false,
      userId: TEST_USER.id,
    };

    it("should return 400 (bad request) without userId", async () => {
      const body = Object.assign({}, task, { userId: null });
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
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
          error:
            "It's not possible to create a new task without the user's ID!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 400 (bad request) with an invalid description", async () => {
      const body = Object.assign({}, task, { description: "" });
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
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
          error: `The value "${body.description}" is not a valid description!`,
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
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
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
          error: "Invalid access token!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with invalid/malformed access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer json.web.token",
        },
        body: JSON.stringify(task),
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
          error: "Invalid access token!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with different userId in body and token", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
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
          error: "It's not possible to create a task for other users!",
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
      const body = Object.assign({}, task, { id: 1 });
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
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
        const expected = { error: `The ID ${body.id} is already registered!` };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 201 (created) and the created tasks", async () => {
      const tasks = [];
      tasks.push(Object.assign({}, task));
      tasks.push(Object.assign({}, task, { id: 8, completed: true }));
      tasks.push(
        Object.assign({}, task, {
          id: 9,
          description: "Test the PUT /tasks/:id route",
        })
      );
      tasks.push(
        Object.assign({}, task, {
          id: 10,
          description: "Test all users routes",
          completed: true,
        })
      );
      tasks.push(
        Object.assign({}, task, {
          id: 11,
          description: "Create the app screens",
        })
      );

      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      for await (const task of tasks) {
        const res = await fetch(`${BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        });
        const expected = 201;
        assert.strictEqual(
          res.status,
          expected,
          `Status should be: ${expected}. Actual: ${res.status}`
        );

        const actual = await res.json();
        assert.ok(actual, `Should've returned the created task`);
      }
    });
  });

  describe("PUT /tasks/:id", () => {
    const task = {
      id: 7,
      description: "Test the PUT /tasks/:id route",
      completed: true,
      userId: TEST_USER.id,
    };

    it("should return 400 (bad request) with an invalid description", async () => {
      const body = Object.assign({}, task, { description: "" });
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
          error: `The value "${body.description}" is not a valid description!`,
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
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
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
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer json.web.token",
        },
        body: JSON.stringify(task),
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

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
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
          error: "It's not possible to fetch another users' tasks!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) when trying to modify the task's id", async () => {
      const body = Object.assign({}, task, { id: 15 });
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
        const expected = { error: "It's not allowed to alter the task's ID!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) when trying to modify the task's userId", async () => {
      const body = Object.assign({}, task, { userId: 1 });
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
        const expected = {
          error: "It's not allowed to alter the task's user ID!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 404 (not found) with an id that's not registered", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/tasks/50`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
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
        const expected = { error: "Task not found!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and the updated task", async () => {
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      const expected = 200;
      assert.strictEqual(
        res.status,
        expected,
        `Status should be: ${expected}. Actual: ${res.status}`
      );

      const actual = await res.json();
      assert.ok(actual, `Should've returned the updated task`);
    });
  });

  describe("GET /tasks", () => {
    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks`, {
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
        const expected = {
          error: "Invalid access token!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 401 (unauthorized) with invalid/malformed access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks`, {
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
        const expected = {
          error: "Invalid access token!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and the user's tasks", async () => {
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks`, {
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
        const expected = [
          {
            id: 7,
            description: "Test the PUT /tasks/:id route",
            completed: true,
            userId: TEST_USER.id,
          },
          {
            id: 8,
            description: "Test the POST /tasks route",
            completed: true,
            userId: TEST_USER.id,
          },
          {
            id: 9,
            description: "Test the PUT /tasks/:id route",
            completed: false,
            userId: TEST_USER.id,
          },
          {
            id: 10,
            description: "Test all users routes",
            completed: true,
            userId: TEST_USER.id,
          },
          {
            id: 11,
            description: "Create the app screens",
            completed: false,
            userId: TEST_USER.id,
          },
        ];
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          "Should have returned the user's tasks"
        );
      }
    });
  });

  describe("GET /tasks/:id", () => {
    const task = {
      id: 10,
      description: "Test all users routes",
      completed: true,
      userId: TEST_USER.id,
    };

    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
          error: "It's not possible to fetch another users' tasks!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 404 (not found) with an id that's not registered", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/tasks/50`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
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
        const expected = { error: "Task not found!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 200 (ok) and the referred task when passed valid access token", async () => {
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
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
        const expected = task;
        const actual = await res.json();
        assert.deepStrictEqual(actual, expected, `Should've returned the task`);
      }
    });
  });

  describe("DELETE /tasks/:id", () => {
    const id = 7;

    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
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
      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
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

      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
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
          error: "It's not possible to fetch another users' tasks!",
        };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 404 (not found) with an id that's not registered", async () => {
      const token = await getToken(BASE_URL);

      const res = await fetch(`${BASE_URL}/tasks/50`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
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
        const expected = { error: "Task not found!" };
        const actual = await res.json();
        assert.deepStrictEqual(
          actual,
          expected,
          `Error message should be: "${expected.error}". Actual: "${actual.error}"`
        );
      }
    });

    it("should return 204 (no content) when task is successfully deleted", async () => {
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
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

  describe("DELETE /tasks/completed", () => {
    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks/completed`, {
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
      const res = await fetch(`${BASE_URL}/tasks/completed`, {
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

    it("should return 200 (ok) and the number of tasks deleted", async () => {
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/completed`, {
        method: "DELETE",
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
        const expected = 2;
        const actual = await res.json();
        assert.strictEqual(
          actual,
          expected,
          `Should've returned: ${expected}. Actual: ${actual}`
        );
      }
    });
  });

  describe("DELETE /tasks/all", () => {
    it("should return 401 (unauthorized) without access token", async () => {
      const res = await fetch(`${BASE_URL}/tasks/all`, {
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
      const res = await fetch(`${BASE_URL}/tasks/all`, {
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

    it("should return 200 (ok) and the number of tasks deleted", async () => {
      const token = await getToken(BASE_URL, {
        user: TEST_USER.username,
        password: TEST_USER.password,
      });

      const res = await fetch(`${BASE_URL}/tasks/all`, {
        method: "DELETE",
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
        const expected = 2;
        const actual = await res.json();
        assert.strictEqual(
          actual,
          expected,
          `Should've returned: ${expected}. Actual: ${actual}`
        );
      }
    });
  });
});
