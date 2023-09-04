const Router = require("express");
const UserController = require("../controller/UserController");

const router = Router();

router
  .get("/user/:id", UserController.getUserById)
  .post("/user", UserController.createUser)
  .post("/user/login", UserController.userLogin)
  .post("/user/auth", UserController.authenticateUser);

module.exports = router;
