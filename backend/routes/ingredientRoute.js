const { getAllIngredients } = require("../controller/ingredientController");
const router = require("express").Router();

router.route("/").get(getAllIngredients);

module.exports = router;
