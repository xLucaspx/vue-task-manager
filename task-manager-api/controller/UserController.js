const { UnauthorizedError } = require("../errors");
const UserServices = require("../services/UserServices");
const { generateHashAndSalt, verifyPassword } = require("../utils/crypto");
const { createJwt, verifyJwt } = require("../utils/jwt");

const userServices = new UserServices();

class UserController {
  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const token = verifyJwt(req.headers.authorization);

      if (id != token.id) {
        throw new UnauthorizedError(
          "It's not possible to fetch information from other users!"
        );
      }

      const user = await userServices.getUserById(id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

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

  static async authenticateUser(req, res) {
    try {
      const token = verifyJwt(req.headers.authorization);
      return res.status(200).json(token);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const token = verifyJwt(req.headers.authorization);

      if (id != token.id) {
        throw new UnauthorizedError(
          "It's not possible to modify other users' information!"
        );
      }

      if (data.password) {
        const { hash, salt } = generateHashAndSalt(data.password);
        data.passwordHash = hash;
        data.salt = salt;
        delete data.password;
      }

      const user = await userServices.updateUser(id, data);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const token = verifyJwt(req.headers.authorization);

      if (id != token.id) {
        throw new UnauthorizedError(
          "It's not possible to delete other users' accounts!"
        );
      }

      await userServices.deleteUser(id);
      return res.status(204).json({});
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
