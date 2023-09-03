const { randomBytes, scryptSync } = require("node:crypto");
const { BadRequestError } = require("../../errors");

function generateHashAndSalt(password) {
  const regex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*\(\)_+\-=\{\[\}\]:;>.<,?\/\|\\])[A-Za-z\d!@#$%&*\(\)_+\-=\{\[\}\]:;>.<,?\/\|\\]{8,}/g;
  try {
    if (!password.match(regex)) {
      throw new BadRequestError(
        "Password doesn't meet the minimum requirements!"
      );
    }

    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");

    return { salt, hash };
  } catch (error) {
    throw error;
  }
}

module.exports = generateHashAndSalt;
