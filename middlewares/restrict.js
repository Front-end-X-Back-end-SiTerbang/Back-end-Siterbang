const jwt = require("jsonwebtoken");
const { ROLE } = require("../utils/enum");

const { JWT_SECRET } = process.env;

module.exports = {
  mustLogin: (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      next();
    } catch (err) {
      if (err.message == "jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }

      next(err);
    }
  },

  mustAdmin: (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "You're not authorized!",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded);

      if (decoded.role !== ROLE.ADMIN) {
        return res.status(403).json({
          status: false,
          message: "You're not authorized!, Only admin can access",
          data: null,
        });
      }
      next();
    } catch (err) {
      if (err.message == "Jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }
      next(err);
    }
  },
};
