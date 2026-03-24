const {
  authenticateToken,
  optionalAuthenticateToken,
  authorizeRole,
} = require("../controller/authController");
const {
  createRecipe,
  getRecipe,
  getRecipes,
  isAuthor,
  deleteRecipe,
  getRandomRecipe,
  updateRecipe,
  getUncheckedRecipes,
  checkRecipe,
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
router
  .route("/unchecked")
  .get(authenticateToken, authorizeRole("moderator"), getUncheckedRecipes);
router
  .route("/check")
  .patch(authenticateToken, authorizeRole("moderator"), checkRecipe);

module.exports = router;
