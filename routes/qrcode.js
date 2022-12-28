const c = require("../controllers");
const express = require("express");
const router = express.Router();

router.post("/", c.qrcode.GenerateQrCode);

module.exports = router;
