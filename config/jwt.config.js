const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const createJWT = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

const JWTAuth = (req, res, next) => {
  // checkHeader
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Invalid authentication")
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = { userId: payload.userId, name: payload.name }
    next();
  } catch(error) {
    throw new UnauthorizedError("Authenticaion Invalid")
  }
}

module.exports = { createJWT, JWTAuth };
