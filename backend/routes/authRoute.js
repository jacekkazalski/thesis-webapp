const {
  signup,
  login,
  refresh,
  logout,
  changePassword,
} = require("../controller/authController");
const { authenticateToken } = require("../controller/authController");
const router = require("express").Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logout").get(logout);
router.route("/change-password").post(authenticateToken, changePassword);

module.exports = router;
