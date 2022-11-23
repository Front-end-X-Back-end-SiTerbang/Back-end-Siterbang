const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.post("/register", controllers.auth.register);
router.get("/activation", controllers.auth.activation);
router.post("/login", controllers.auth.login);
router.get("/get", controllers.auth.getAll);

module.exports = router;
