require("dotenv").config();
const { User } = require("../models");
const { ROLE, TYPE, VERIFIED } = require("../utils/enum");
const { JWT_SECRET, GOOGLE_SENDER_EMAIL } = process.env;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const activateAccount = require("../utils/email/activateAccountEmail");
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
        postal_code,
        photo,
        role = ROLE.BUYER,
        user_type = TYPE.BASIC,
        is_verified = VERIFIED.FALSE,
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
      const token = crypto.randomBytes(30).toString("hex");
      const newUser = await User.create({
        name,
        email,
        emailToken: token,
        password: encryptedPassword,
        phone,
        address,
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
        data: newUser,
      });
    } catch (err) {
      console.log(err);
    }
  },
  activation: async (req, res, next) => {
    try {
      const { emailToken } = req.query;
      const user = await User.findOne({ where: { emailToken } });
      // console.log(emailToken);
      // if (!user) {
      //   return res.send(`
      // <div>
      // <h1>Activation Failed</h1>
      // <h3>Token invalid</h3>
      // </div>`);
      // }

      await User.update(
        { is_verified: VERIFIED.TRUE },
        { where: { id: user.id } }
      );

      return res.redirect("/auth/login");
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
          message: "data is not found!",
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
};
