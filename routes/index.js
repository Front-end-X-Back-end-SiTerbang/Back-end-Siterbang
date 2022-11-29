const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airlines = require("./airlines");

router.use("/auth", auth);
router.use("/airlines", airlines);

module.exports = router;
