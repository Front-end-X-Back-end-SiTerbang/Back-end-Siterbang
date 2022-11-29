const express = require("express");
const router = express.Router();
const airlines = require("../controllers/airlines");
const mid = require("../middlewares/restrict");

router.get("/all", mid.mustLogin, mid.mustAdmin, airlines.getAll);
router.get("/:id", mid.mustLogin, mid.mustAdmin, airlines.get);
router.post("/", mid.mustLogin, mid.mustAdmin, airlines.createAirline);
router.put("/:id", mid.mustLogin, mid.mustAdmin, airlines.update);
router.delete("/:id", mid.mustLogin, mid.mustAdmin, airlines.delete);

module.exports = router;
