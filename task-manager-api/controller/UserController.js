const { UnauthorizedError } = require("../errors");
const UserServices = require("../services/UserServices");
const { generateHashAndSalt, verifyPassword } = require("../utils/crypto");
const { createJwt } = require("../utils/jwt");

const userServices = new UserServices();

class UserController {
  static async createUser(req, res) {
    const user = req.body;

    try {
      const { hash, salt } = generateHashAndSalt(user.password);
      user.passwordHash = hash;
      user.salt = salt;
      delete user.password;

      const createdUser = await userServices.createUser(user);
      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async userLogin(req, res) {
    const { user, password } = req.body;

    try {
      const { id, name, passwordHash, salt } = user.match(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g
      )
        ? await userServices.getUserLogin({ email: user })
        : await userServices.getUserLogin({ username: user });

      if (!verifyPassword(password, passwordHash, salt)) {
        throw new UnauthorizedError("Incorrect password!");
      }

      const token = createJwt({ id, name });
      return res.status(200).json(token);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
