const { User, Payment } = require("../models");
const imagekit = require("../utils/media_handling/image-kit");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);
      const { name, email, phone, address, gender, postal_code } = req.body;

      const update = await User.update(
        {
          name,
          email,
          phone,
          address,
          postal_code,
          gender,
        },
        { where: { id: user.id } }
      );
      const updated = await User.findOne({
        where: { id: user.id },
      });
      return res.status(200).json({
        status: true,
        message: "Update profile successfully!",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
  updatePasswords: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);
      const { old_password, password, confirm_new_password } = req.body;

      const userPw = await User.findOne({
        where: { id: user.id },
      });

      const match = await bcrypt.compare(old_password, userPw.password);
      if (!match) {
        return res.status(401).json({
          status: false,
          message: "wrong password",
          data: null,
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          status: false,
          message: "Minimum password is 8 character",
        });
      }

      if (password != confirm_new_password) {
        return res.status(401).json({
          status: false,
          message: "Password doesn't match!",
          data: null,
        });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const updated = await User.update(
        {
          password: encryptedPassword,
        },
        { where: { id: user.id } }
      );

      return res.status(200).json({
        status: true,
        message: "Update password successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  getUserInfo: async (req, res, next) => {
    const token = req.headers["authorization"];
    const user = jwt.verify(token, JWT_SECRET);

    const userData = await User.findOne({
      where: { id: user.id },
      attributes: [
        "name",
        "email",
        "phone",
        "gender",
        "postal_code",
        "address",
        "photo",
      ],
    });
    return res.status(200).json({
      status: true,
      message: "success get user information",
      data: userData,
    });
  },
  updateAvatar: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      const user = jwt.verify(token, JWT_SECRET);

      const file = req.file.buffer.toString("base64");

      if (!file) {
        return res.status(400).json({
          status: false,
          message: "file not found",
          data: null,
        });
      }

      const uploadPhoto = await imagekit.upload({
        file,
        fileName: req.file.originalname,
      });

      const updated = await User.update(
        {
          photo: uploadPhoto.url,
        },
        { where: { id: user.id } }
      );

      return res.status(200).json({
        status: true,
        message: "Update Photo Succesfull!",
        data: updated.photo,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;

      const userExist = await User.findOne({
        where: { id },
      });

      if(!userExist) {
        return res.status(404).json({
          
        })
      }

      const deleted = await User.destroy({ where: { id } });

      return res.status(200).json({
        status: true,
        message: "delete data successful!",
        dat: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
  countUser: async (req, res, next) => {
    try {
      const countUser = await User.count({ where: { role: "BUYER" } });
      const countAdmin = await User.count({ where: { role: "ADMIN" } });
      return res.status(200).json({
        status: true,
        message: "success count user data",
        data: {
          user: countUser,
          admin: countAdmin,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
