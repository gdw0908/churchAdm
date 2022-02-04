const express = require('express');
const router = express.Router();
const controller = require('../controller/qnaController');


/* 라우팅 로직 */
router.post('/apirole/qnaList', controller.qnaManage);
router.post('/apirole/qnaInsert', controller.qnaManage);
router.post('/apirole/qnaParentSeq', controller.qnaManage);
router.post('/apirole/qnaInfo', controller.qnaManage);
router.post('/apirole/qnaUpdate', controller.qnaManage);
router.post('/apirole/qnaDelete', controller.qnaManage);
router.post('/apirole/qnaComment', controller.qnaManage);

module.exports = router;