const express = require('express');
const router = express.Router();

const controller = require('../controller/adminController');

/* 라우팅 로직 */
router.post('/apirole/adminList', controller.adminManage);
router.post('/apirole/adminInsert', controller.adminManage);
router.post('/apirole/adminUpdate', controller.adminManage);
router.post('/apirole/adminDelete', controller.adminManage);

module.exports = router;
