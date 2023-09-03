const { UniqueConstraintError, DatabaseError } = require("sequelize");
const { ConflictError, BadRequestError, NotFoundError } = require("../errors");
const db = require("../models");

class Services {
  constructor(modelName) {
    this.model = db[modelName];
  }

  async getOneRecord(where = {}) {
    try {
      const record = await this.model.findOne({ where: { ...where } });

      if (record) return record;

      throw new NotFoundError("No records were found!");
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new BadRequestError("Invalid where clause!");
      }
      throw error;
    }
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
