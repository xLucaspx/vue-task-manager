const { UniqueConstraintError, ValidationError } = require("sequelize");
const { ConflictError, BadRequestError } = require("../errors");
const Services = require("./Services");

class UserServices extends Services {
  constructor() {
    super("User");
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
}

module.exports = UserServices;
