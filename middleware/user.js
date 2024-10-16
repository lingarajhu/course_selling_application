const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
  const token = req.headers.token;
  const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not siggned in",
    });
  }
};

module.exports = {
  userMiddleware,
};
