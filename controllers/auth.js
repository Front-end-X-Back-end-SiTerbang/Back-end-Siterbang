require("dotenv").config();
const { User } = require("../models");
const { ROLE } = require("../utils/enum");
const { TYPE } = require("../utils/enum");
const { JWT_SECRET } = process.env;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  register: async (req, res, next) => {
    try {
      const {
        name,
        email,
        password,
        confirm_password,
        phone,
        address,
        postal_code,
        photo,
        role = ROLE.BUYER,
        user_type = TYPE.BASIC,
        is_verified = false,
      } = req.body;

      // Check Password
      if (password != confirm_password) {
        return (
          res.render("auth/register"),
          {
            error: "password doesnt match!",
          }
        );
      }

      // Check User
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(409).json({
          status: false,
          message: "email already exist!",
          data: null,
        });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: encryptedPassword,
        phone,
        address,
        postal_code,
        photo,
        role,
        user_type,
        is_verified,
      });

      // console.log(token);

      return res.status(201).json({
        status: true,
        message: "Register success!",
        data: newUser,
      });
    } catch (err) {
      next(err);
    }
  },
};
