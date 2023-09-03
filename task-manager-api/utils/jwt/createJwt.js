const jwt = require("jsonwebtoken");

function createJwt(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "8h" });
}

module.exports = createJwt;
