const { authenticateToken } = require("../controller/authController");
const router = require("express").Router();
const {toggleFavourite, isFavourite} = require("../controller/favouriteController");

router.route('/toggle').post(authenticateToken, toggleFavourite);
router.route('/check').get(authenticateToken, isFavourite);

module.exports = router;