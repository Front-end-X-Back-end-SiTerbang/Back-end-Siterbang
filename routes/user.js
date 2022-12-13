const c = require("../controllers");
const express = require("express");
const router = express.Router();
const mid = require("../middlewares");

const upload = require("../utils/media_handling/storage");

router.put(
  "/profile/photo/:id",
  mid.restrict.mustLogin,
  upload.image.single("photo"),
  c.user.updateAvatar
);
router.put("/profile/:id", mid.restrict.mustLogin, c.user.updateProfile);
router.put(
  "/profile/change-password/:id",
  mid.restrict.mustLogin,
  c.user.updatePasswords
);

module.exports = router;
