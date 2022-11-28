const { ROLE } = require("../utils/enum");

module.exports = (access = false) => {
  return async (req, res, next) => {
    const { role } = req.user;

    if (!access) {
      return res
        .status(401)
        .json({ status: false, message: "you're not authorized!", data: null });
    }

    if (!role) {
      return res
        .status(401)
        .json({ status: false, message: "you're not authorized!", data: null });
    }
    if (role != ROLE.ADMIN) {
      return res
        .status(401)
        .json({ status: false, message: "you're not an Admin!", data: null });
    }

    next();
  };
};
