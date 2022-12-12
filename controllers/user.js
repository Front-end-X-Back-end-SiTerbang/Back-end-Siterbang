const { User, Payment } = require("../models");
const imagekit = require("../utils/media_handling/image-kit");

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address, gender, is_verified, postal_code } =
        req.body;

      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found!",
        });
      }

      const updated = await User.update(
        {
          name,
          email,
          phone,
          address,
          phone,
          postal_code,
          gender,
        },
        { where: { id } }
      );

      return res.status(200).json({
        status: true,
        message: "Update profile successfully!",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  updatePasswords: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { old_password, password, confirm_new_password } = req.body;

      const user = await User.findOne({ where: { id } });

      const match = await bcrypt.compare(old_password, user.password);
      if (!match) {
        return res.status(401).json({
          status: false,
          message: "password doesn't match",
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

      const updated = await User.update({
        password: encryptedPassword,
      });

      return res.status(200).json({
        status: true,
        message: "Update password successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      const { id } = req.params;
      const file = req.file.buffer.toString("base64");
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }

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
        { where: { id } }
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
