const { UniqueConstraintError } = require("sequelize");
const { ConflictError } = require("../errors");
const db = require("../models");

class Services {
  constructor(modelName) {
    this.model = db[modelName];
  }

  async createRecord(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      if (error instanceof UniqueConstraintError && error.fields.PRIMARY) {
        throw new ConflictError(
          `The ID ${error.fields.PRIMARY} is already registered!`
        );
      }

      throw error;
    }
  }
}

module.exports = Services;
