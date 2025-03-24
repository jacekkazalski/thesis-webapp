const { authenticateToken } = require("../controller/authController");
const {createRecipe, getRecipe, getAllRecipes, addToFavourites, removeFromFavourites} = require("../controller/recipeController");
const router = require("express").Router();
const upload = require('../config/multerConfig')

router.route('/create').post(authenticateToken, upload.single('image'), createRecipe)
router.route('/recipe').get(getRecipe)
router.route('/').get(getAllRecipes)
router.route('/favourites').post(authenticateToken, addToFavourites)

module.exports = router;