const express = require('express');
const router = express.Router();
const controller = require('../controller/freeboardController');


/* 라우팅 로직 */
router.post('/apirole/freeboardList', controller.freeboardManage);
router.post('/apirole/freeboardInsert', controller.freeboardManage);
router.post('/apirole/freeboardUpdate', controller.freeboardManage);
router.post('/apirole/freeboardDelete', controller.freeboardManage);
router.post('/apirole/freeboardDetail', controller.freeboardManage);
router.post('/apirole/freeboardComment', controller.freeboardManage);
router.post('/apirole/commentDelete', controller.freeboardManage);

module.exports = router;