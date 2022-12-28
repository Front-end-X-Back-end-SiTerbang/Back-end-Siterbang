const { QrCode } = require("../models");
const imagekit = require("../utils/media_handling/image-kit");
const qr = require("qr-image");
const crypto = require("node:crypto");

module.exports = {
  GenerateQrCode: async (req, res, next) => {
    try {
      const { nama } = req.body;

      const uniqueCode = crypto.randomBytes(30).toString("hex");
      const generate = qr.imageSync(uniqueCode, { type: "png" });
      const file = generate.toString("base64");

      const upload = await imagekit.upload({
        file,
        fileName: "qr-code",
      });

      const data = upload.url;

      const genQrCode = await QrCode.create({
        nama,
        qrcode: data,
      });

      return res.status(201).json({
        status: true,
        message: "Generate QR Code Successful",
        data: genQrCode,
      });
    } catch (err) {
      next(err);
    }
  },
};
