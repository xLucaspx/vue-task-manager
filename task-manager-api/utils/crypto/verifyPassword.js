const { scryptSync, timingSafeEqual } = require("node:crypto");

function verifyPassword(typedPassword, originalHash, salt) {
  const inputHash = scryptSync(typedPassword, salt, 64);
  const realHash = Buffer.from(originalHash, "hex");

  return timingSafeEqual(inputHash, realHash);
}

module.exports = verifyPassword;
