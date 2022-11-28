const express = require("express");
const router = express.Router();
const airlines = require("../controllers/airlines");

router.get("/", airlines.getAll);
router.get("/:id", airlines.get);
router.post("/", airlines.createAirline);
router.put("/:id", airlines.update);
router.delete("/:id", airlines.delete);

module.exports = router;
