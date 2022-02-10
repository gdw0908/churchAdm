const express = require('express')
const router = express.Router()
const controller = require('../controller/loginController')

/* 라우팅 로직 */
router.post('/api/adminLogin', controller.login)

module.exports = router
