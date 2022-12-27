const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.post("/register", controllers.auth.register);
router.get("/google", controllers.auth.google);
// router.post("/google", controllers.auth.google);
router.get("/activation", controllers.auth.activation);
router.post("/login", controllers.auth.login);
router.get("/get", controllers.auth.getAll);
router.post("/forgot-password", controllers.auth.forgotPassword);
router.put("/reset-password/:token", controllers.auth.resetPassword);
router.get("/", controllers.auth.search);
module.exports = router;
