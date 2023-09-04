const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../../errors");

function verifyJwt(token) {
  try {
    token = token.replace(/bearer\s{1,}/gi, "");
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Invalid access token!");
  }
}

module.exports = verifyJwt;
