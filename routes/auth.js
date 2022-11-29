const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const mid = require('../middlewares/restrict');

router.post("/register", controllers.auth.register);
router.get("/activation", controllers.auth.activation);
router.post("/login", controllers.auth.login);
router.get("/get", controllers.auth.getAll);
router.post("/forgot-password", mid.mustLogin, controllers.auth.forgotPassword);
router.post("/reset-password", mid.mustLogin, controllers.auth.resetPassword);

module.exports = router;
