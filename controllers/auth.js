require("dotenv").config();
const { User } = require("../models");
const { ROLE, TYPE, VERIFIED } = require("../utils/enum");
const { JWT_SECRET, GOOGLE_SENDER_EMAIL } = process.env;
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const activateAccount = require("../utils/email/activateAccountEmail");
const resetPassword = require("../utils/email/resetAccountEmail");
const sendEmail = require("../utils/email/email");

module.exports = {
  register: async (req, res, next) => {
    try {
      const {
        name,
        email,
        emailToken,
        password,
        confirm_password,
        phone,
        address,
        gender,
        postal_code,
        photo,
        role = ROLE.BUYER,
        user_type = TYPE.BASIC,
        is_verified = VERIFIED.FALSE,
      } = req.body;

      if (password.length < 8) {
        return res.status(400).json({
          status: false,
          message: "At least password has 8 character",
        });
      }

      // Check Password
      if (password != confirm_password) {
        return res.status(400).json({
          status: false,
          message: "password doesnt match!",
          data: null,
        });
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
      const token = crypto.randomBytes(30).toString("hex");
      const newUser = await User.create({
        name,
        email,
        emailToken: token,
        password: encryptedPassword,
        phone,
        address,
        gender,
        postal_code,
        photo,
        role,
        user_type,
        is_verified,
      });

      // Send email for activate account
      const templateEmail = {
        to: req.body.email.toLowerCase(),
        subject: "Activate Your Account!",
        html: activateAccount(
          `https://siterbang-develop.up.railway.app/auth/activation?emailToken=${token}`
        ),
      };
      await sendEmail.sendEmail(templateEmail);
      await User.update({ emailToken: token }, { where: { email } });

      return res.status(201).json({
        status: true,
        message: "Register success!",
        data: {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  activation: async (req, res, next) => {
    try {
      const { emailToken } = req.query;
      const user = await User.findOne({ where: { emailToken } });

      await User.update(
        { is_verified: VERIFIED.TRUE },
        { where: { id: user.id } }
      );

      return res.redirect("http://siterbang-staging.km3ggwp.com/login");
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "email is not found!",
          data: null,
        });
      }

      if (user.is_verified === VERIFIED.FALSE) {
        return res.status(401).json({
          status: false,
          message: "your account is not verified!, please check your email",
          data: null,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({
          status: false,
          message: "password doesnt match!",
          data: null,
        });
      }

      const payload = {
        id: user.id,
        role: user.role,
      };
      const token = jwt.sign(payload, JWT_SECRET);

      return res.status(200).json({
        status: true,
        message: "login successful!",
        data: {
          email: user.email,
          token: token,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const user = await User.findAll();

      if (!user.length) {
        return res.status(200).json({
          status: false,
          message: "empty data",
          data: user,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Get data success!",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (user) {
        const payload = { user_id: user.id };
        const token = jwt.sign(payload, JWT_SECRET);
        const templateResetPassword = {
          to: req.body.email.toLowerCase(),
          subject: "Reset Your Password!",
          html: resetPassword(
            `http://siterbang-staging.km3ggwp.com/auth/reset-password/${token}`
          ),
        };
        await sendEmail.sendEmail(templateResetPassword);
      }

      return res.status(200).json({
        status: true,
        message: "request forgot-password successful!",
        data: req.body.email,
      });
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password, confirm_new_password } = req.body;

      if (!token)
        return res.status(401).json({
          status: false,
          message: "invalid token",
        });

      if (password.length < 8) {
        return res.status(400).json({
          status: false,
          message: "At least password has 8 character!",
        });
      }

      if (password != confirm_new_password)
        return res.status(400).json({
          status: false,
          message: "password doesn't match!",
        });

      const payload = jwt.verify(token, JWT_SECRET);
      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.update(
        { password: encryptedPassword },
        { where: { id: payload.user_id } }
      );

      return res.status(200).json({
        status: true,
        message: "Update password success!",
      });
    } catch (err) {
      console.log(err);
    }
  },

  search: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = limit * page;
      const totalRows = await User.count({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await User.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      next(error);
    }
  },
};
