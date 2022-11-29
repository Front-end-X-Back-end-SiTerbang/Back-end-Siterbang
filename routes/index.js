const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airlines = require("./airlines");
const airplane = require("./airplane");
const product = require("./product");

router.use("/auth", auth);
router.use("/airlines", airlines);
router.use("/airplanes", airplane);
router.use("/products", product);
module.exports = router;
