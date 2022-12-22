const express = require("express");
const router = express.Router();
const mid = require("../middlewares");
const c = require("../controllers");

router.get("/all", c.airport.getAll);
router.get("/:iata_code", mid.restrict.mustAdmin, c.airport.get);
router.post("/", mid.restrict.mustAdmin, c.airport.createAirport);
router.put("/:iata_code", mid.restrict.mustAdmin, c.airport.update);
router.delete("/:iata_code", mid.restrict.mustAdmin, c.airport.delete);
router.get("/", c.airport.search);
module.exports = router;
