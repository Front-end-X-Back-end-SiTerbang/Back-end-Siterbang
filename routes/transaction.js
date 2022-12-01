const express = require("express");
const router = express.Router();
const c = require("../controllers");
const mid = require("../middlewares");

router.get("/all", mid.restrict.mustAdmin, c.transaction.getAll);
router.post("/", mid.restrict.mustAdmin, c.transaction.createTransaction);

module.exports = router;
