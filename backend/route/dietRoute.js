const { getAllDiets, getUserDiet } = require("../controller/dietController");
const { authenticateToken } = require("../controller/authController");
const router = require("express").Router();

router.route("/").get(getAllDiets);
router.route("/user").get(authenticateToken, getUserDiet);

module.exports = router;
