const express = require("express");
const router = express.Router();
const auth = require("./auth");
const airlines = require("./airlines");
const airplane = require("./airplane");
const product = require("./product");
const airport = require("./airports");
const transaction = require("./transaction");
const user = require("./user");
const booking = require("./booking");
const payment = require("./payment");
const qrcode = require("./qrcode");
const mid = require("../middlewares");
const c = require("../controllers");

router.use("/auth", auth);
router.use("/airlines", airlines);
router.use("/airplanes", airplane);
router.use("/products", product);
router.use("/airports", airport);
router.use("/transactions", transaction);
router.use("/payments", payment);
router.use("/booking", booking);
router.use("/user", user);
router.use("/generateqrcode", qrcode);

//get user transaction
router.get(
  "/my-transactions",
  mid.restrict.mustLogin,
  c.transaction.getUserTransaction
);

//stats
router.get("/total-airline", mid.restrict.mustAdmin, c.airline.count);
router.get("/total-airplane", mid.restrict.mustAdmin, c.airplane.count);
router.get("/total-airport", mid.restrict.mustAdmin, c.airport.count);
router.get("/total-booking", mid.restrict.mustAdmin, c.booking.count);
router.get("/total-product", mid.restrict.mustAdmin, c.product.count);
router.get(
  "/total-transaction",
  mid.restrict.mustAdmin,
  c.transaction.countAll
);
router.get("/total-revenue", mid.restrict.mustAdmin, c.transaction.revenue);
router.get("/total-user", mid.restrict.mustAdmin, c.user.countUser);

module.exports = router;
