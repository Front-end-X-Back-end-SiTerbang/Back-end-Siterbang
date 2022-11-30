const express = require("express");
const router = express.Router();
const mid = require("../middlewares");
const c = require("../controllers");

router.get("/all", mid.restrict.mustAdmin, c.airport.getAll);
router.get("/:iata_code", mid.restrict.mustAdmin, c.airport.get);
router.post("/", mid.restrict.mustAdmin, c.airport.createAirport);
router.put("/:iata_code", mid.restrict.mustAdmin, c.airport.update);
router.delete("/:iata_code", mid.restrict.mustAdmin, c.airport.delete);
module.exports = router;
