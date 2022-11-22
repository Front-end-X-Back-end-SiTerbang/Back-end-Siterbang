const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.post("/register", controllers.auth.register);

module.exports = router;
