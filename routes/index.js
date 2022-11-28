const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airlines = require("./airlines");
const isAdmin = require("../middlewares/isAdmin");

router.use("/auth", auth);
router.use("/airlines", airlines);

module.exports = router;
