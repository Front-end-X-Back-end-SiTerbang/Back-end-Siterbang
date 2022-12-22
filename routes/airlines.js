const express = require("express");
const router = express.Router();
const airlines = require("../controllers/airlines");
const mid = require("../middlewares");

router.get("/" , mid.restrict.mustAdmin, airlines.search)
router.get("/all", mid.restrict.mustAdmin, airlines.getAll);
router.get("/:id", mid.restrict.mustAdmin, airlines.get);
router.post("/", mid.restrict.mustAdmin, airlines.createAirline);
router.put("/:id", mid.restrict.mustAdmin, airlines.update);
router.delete("/:id", mid.restrict.mustAdmin, airlines.delete);

module.exports = router;
