const { authenticateToken } = require("../controller/authController");
const router = require("express").Router();
const {toggleFavourite, isFavourite, getUserFavourites} = require("../controller/favouriteController");

router.route('/toggle').post(authenticateToken, toggleFavourite);
router.route('/check').get(authenticateToken, isFavourite);
router.route('/user').get(getUserFavourites);

module.exports = router;