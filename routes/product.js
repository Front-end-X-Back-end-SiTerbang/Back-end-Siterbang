const express = require("express");
const router = express.Router();
const c = require("../controllers");
const mid = require("../middlewares");

router.get("/search", c.product.search);
router.get("/all", mid.restrict.mustAdmin, c.product.getAll);
router.get("/:id", mid.restrict.mustLogin, c.product.get);
router.post("/", mid.restrict.mustAdmin, c.product.create);
router.put("/:id", mid.restrict.mustAdmin, c.product.update);
router.delete("/:id", mid.restrict.mustAdmin, c.product.delete);
module.exports = router;
