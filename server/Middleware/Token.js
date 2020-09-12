const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next();

    const { userId } = jwt.verify(token.toString(), "abc123");
    if (!userId) return next();

    req.userId = userId;
    next();
  } catch (e) {
    next();
  }
};
