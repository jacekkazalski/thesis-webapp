const {
  getUser,
  deleteUser,
  addUserIngredient,
  removeUserIngredient,
  getUserIngredients,
  addPredefinedDietToUser,
  removePredefinedDietFromUser,
  getUserRecipes,
} = require("../controller/userController");
const { authenticateToken } = require("../controller/authController");
const router = require("express").Router();

router.route("/").get(getUser);
router.route("/").delete(authenticateToken, deleteUser);
router.route("/ingredients").post(authenticateToken, addUserIngredient);
router.route("/ingredients").delete(authenticateToken, removeUserIngredient);
router.route("/ingredients").get(authenticateToken, getUserIngredients);
router.route("/diet").post(authenticateToken, addPredefinedDietToUser);
router.route("/diet").delete(authenticateToken, removePredefinedDietFromUser);
router.route("/recipes").get(getUserRecipes);

module.exports = router;
