const express = require('express');
const router = express.Router();
const controller = require('../controller/noticeController');


/* 라우팅 로직 */
router.post('/apirole/noticeList', controller.noticeManage);
router.post('/apirole/noticeInfo', controller.noticeManage);
router.post('/apirole/noticeInsert', controller.noticeManage);
router.post('/apirole/noticeUpdate', controller.noticeManage);
router.post('/apirole/noticeDelete', controller.noticeManage);

module.exports = router;