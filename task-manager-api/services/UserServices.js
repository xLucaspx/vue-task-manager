const { UniqueConstraintError, ValidationError } = require("sequelize");
const { ConflictError, BadRequestError, NotFoundError } = require("../errors");
const Services = require("./Services");
const { deleteUser } = require("../controller/UserController");

class UserServices extends Services {
  constructor() {
    super("User");
  }

  async getUserById(id) {
    try {
      return await this.getOneRecord({ id });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError("User not found!");
      }
      throw error;
    }
  }

  async getUserLogin(filter) {
    try {
      const user = await this.model.scope("login").findOne({
        where: { ...filter },
      });

      if (user) return user;

      throw new NotFoundError("User not found!");
    } catch (error) {
      throw error;
    }
  }

  async createUser(user) {
    try {
      return await this.createRecord(user);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const { fields } = error;

        if (!fields) {
          throw new BadRequestError(
            "Please, check if all the fields are filled correctly!"
          );
        }

        if (fields.email) {
          throw new ConflictError(
            `The email ${fields.email} is already registered!`
          );
        }

        if (fields.username) {
          throw new ConflictError(
            `The username ${fields.username} is already registered!`
          );
        }
      }

      if (error instanceof ValidationError) {
        if (!error.errors || error.errors.length === 0) {
          throw new BadRequestError(
            "Please, check if all the fields are filled correctly!"
          );
        }

        const errorData = error.errors.pop();

        if (errorData.path === "email") {
          throw new BadRequestError(
            `The value "${errorData.value}" is not a valid e-mail address!`
          );
        }

        if (errorData.path === "username") {
          throw new BadRequestError(
            `The value "${errorData.value}" is not a valid username!`
          );
        }

        if (errorData.path === "name") {
          throw new BadRequestError(
            `The value "${errorData.value}" does not match the name requirements!`
          );
        }
      }
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.getUserById(id);
      await user.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserServices;
