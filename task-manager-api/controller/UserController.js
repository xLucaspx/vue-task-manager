const UserServices = require("../services/UserServices");
const generateHashAndSalt = require("../utils/crypto/generateHashAndSalt");

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
}

module.exports = UserController;
