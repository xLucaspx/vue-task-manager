const Router = require("express");
const UserController = require("../controller/UserController");

const router = Router();

router.post("/user", UserController.createUser);

module.exports = router;
