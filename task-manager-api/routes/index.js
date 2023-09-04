const user = require("./userRoutes");
const tasks = require("./taskRoutes");

module.exports = (app) => app.use(user, tasks);
