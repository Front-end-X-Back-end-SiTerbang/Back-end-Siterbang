const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.post("/register", controllers.auth.register);
router.get("/activation", controllers.auth.activation);
router.post("/login", controllers.auth.login);
router.get("/get", controllers.auth.getAll);
router.post("/forgot-password", controllers.auth.forgotPassword);
router.post("/reset-password", controllers.auth.resetPassword);

module.exports = router;
