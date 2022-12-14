const express = require("express");
const router = express.Router();
const airplane = require("../controllers/airplane");
const mid = require("../middlewares");

router.get('/', mid.restrict.mustAdmin , airplane.search)
router.get("/all", mid.restrict.mustAdmin, airplane.getAll);
router.get("/:id", mid.restrict.mustAdmin, airplane.get);
router.get(
  "/airlines-id/:airlines_id",
  mid.restrict.mustAdmin,
  airplane.getByAirlines
);
router.post("/", mid.restrict.mustAdmin, airplane.createAirplane);
router.put("/:id", mid.restrict.mustAdmin, airplane.update);
router.delete("/:id", mid.restrict.mustAdmin, airplane.delete);

module.exports = router;
