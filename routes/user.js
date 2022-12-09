const c = require("../controllers");
const express = require("express");
const router = express.Router();
const mid = require("../middlewares");

const multer = require("multer");
const upload = multer();

router.put(
  "/profile/photo/:id",
  mid.restrict.mustLogin,
  upload.single("photo"),
  c.user.updateAvatar
);
router.put("/profile/:id", mid.restrict.mustLogin, c.user.updateProfile);
router.put(
  "/profile/change-password/:id",
  mid.restrict.mustLogin,
  c.user.updatePasswords
);

module.exports = router;
