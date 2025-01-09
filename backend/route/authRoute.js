const {signup, login, refresh, logout} = require("../controller/authController");
const router = require("express").Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/refresh').get(refresh)
router.route('/logout').get(logout)

module.exports = router;