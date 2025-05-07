const {authenticateToken} = require("../controller/authController");
const router = require("express").Router();
const {getUserRating, getRecipeRating, addRating, deleteRating} = require("../controller/ratingController");

router.route('/user').get(authenticateToken, getUserRating);
router.route('/recipe').get(getRecipeRating);
router.route('/add').post(authenticateToken, addRating);
router.route('/delete').delete(authenticateToken, deleteRating);

module.exports = router;