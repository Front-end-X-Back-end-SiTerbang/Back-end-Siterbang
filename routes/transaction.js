const express = require("express");
const router = express.Router();
const c = require("../controllers");
const mid = require("../middlewares");

router.get("/all", mid.restrict.mustAdmin, c.transaction.getAll);
router.post("/", mid.restrict.mustLogin, c.transaction.createTransaction);
router.get("/:id", mid.restrict.mustLogin, c.transaction.get);
router.get(
  "/products/:id",
  mid.restrict.mustAdmin,
  c.transaction.getProductTransaction
);
router.put("/:id", mid.restrict.mustLogin, c.transaction.payment);
router.get(
  "/cancel/:id",
  mid.restrict.mustLogin,
  c.transaction.cancelTransaction
);
router.put(
  "/notif/:id",
  mid.restrict.mustLogin,
  c.transaction.updateTransactionRead
);

module.exports = router;
