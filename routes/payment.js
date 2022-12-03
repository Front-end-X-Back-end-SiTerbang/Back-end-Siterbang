const express = require("express");
const router = express.Router();
const c = require("../controllers");
const mid = require("../middlewares");

router.get("/all", mid.restrict.mustAdmin, c.payment.getAll);
router.get("/:id", mid.restrict.mustLogin, c.payment.get);
router.post("/", mid.restrict.mustLogin, c.payment.createPayment);
router.put("/top-up/:id", mid.restrict.mustLogin, c.payment.topUp);
router.put("/:id", mid.restrict.mustLogin, c.payment.update);
router.delete("/:id", mid.restrict.mustLogin, c.payment.delete);

module.exports = router;
