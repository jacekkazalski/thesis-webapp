const {
  authenticateToken,
  optionalAuthenticateToken,
} = require("../controller/authController");
const {
  createRecipe,
  getRecipe,
  getRecipes,
  isAuthor,
  deleteRecipe,
  getRandomRecipe,
  updateRecipe,
} = require("../controller/recipeController");
const router = require("express").Router();
const upload = require("../config/multerConfig");

router
  .route("/create")
  .post(authenticateToken, upload.single("image"), createRecipe);
router
  .route("/update")
  .put(authenticateToken, upload.single("image"), updateRecipe);
router.route("/recipe").get(getRecipe);
router.route("/").get(optionalAuthenticateToken, getRecipes);
router.route("/author/check").get(authenticateToken, isAuthor);
router.route("/delete").delete(authenticateToken, deleteRecipe);
router.route("/random").get(getRandomRecipe);

module.exports = router;
