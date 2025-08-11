const {getUser} = require('../controller/userController')
const router = require('express').Router()

router.route('/').get(getUser)


module.exports = router