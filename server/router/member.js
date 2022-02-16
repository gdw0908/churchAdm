const express = require('express')
const router = express.Router()

const controller = require('../controller/memberController')

/* 라우팅 로직 */
router.post('/apirole/memberList', controller.memberManage)
router.post('/apirole/memberInfo', controller.memberManage)
router.post('/apirole/idDupleChk', controller.memberManage)
router.post('/apirole/memberInsert', controller.memberManage)
router.post('/apirole/memberUpdate', controller.memberManage)
router.post('/apirole/memberDelete', controller.memberManage)

module.exports = router
