const c = require("../controllers");
const express = require("express");
const router = express.Router();
const mid = require("../middlewares");

const upload = require("../utils/media_handling/storage");

router.get("/", mid.restrict.mustLogin, c.user.getUserInfo);
router.put(
  "/profile/photo",
  mid.restrict.mustLogin,
  upload.image.single("photo"),
  c.user.updateAvatar
);
router.put("/profile", mid.restrict.mustLogin, c.user.updateProfile);
router.put(
  "/profile/change-password",
  mid.restrict.mustLogin,
  c.user.updatePasswords
);

module.exports = router;
