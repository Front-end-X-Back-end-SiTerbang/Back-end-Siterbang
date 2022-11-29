const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airlines = require("./airlines");
const airplane = require("./airplane");

router.use("/auth", auth);
router.use("/airlines", airlines);
router.use("/airplanes", airplane);

module.exports = router;
