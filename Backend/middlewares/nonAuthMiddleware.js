const jwt = require("jsonwebtoken");

const nonAuthMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
  console.log("Decoded non auth : ", decoded);
  req.user = decoded;
  next();
};

module.exports = nonAuthMiddleware;
