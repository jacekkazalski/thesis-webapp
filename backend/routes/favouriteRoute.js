const { authenticateToken } = require("../controller/authController");
const router = require("express").Router();
const {
  toggleFavourite,
  isFavourite,
  getFavourites,
} = require("../controller/favouriteController");

router.route("/toggle").post(authenticateToken, toggleFavourite);
router.route("/check").get(authenticateToken, isFavourite);
router.route("/user").get(getFavourites);

module.exports = router;
