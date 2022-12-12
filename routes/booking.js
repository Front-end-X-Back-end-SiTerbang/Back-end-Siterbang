const express = require("express");
const router = express.Router();
const mid = require("../middlewares");
const c = require("../controllers");

router.get("/:transaction_id", mid.restrict.mustLogin, c.booking.get);
router.post("/:transaction_id", mid.restrict.mustLogin, c.booking.createBooking);

module.exports = router;
