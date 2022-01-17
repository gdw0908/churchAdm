const express = require('express');
const morgan = require('morgan');
const { stream } = require('./winston')();
const app = express();
const session = require('express-session');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'utils/upload/images/' });

const login = require('./router/login.js');
const admin = require('./router/admin.js');
const qna = require('./router/qna.js');
const utils = require('./utils/utils');

app.use(session({
  secret: 'secret code',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 30 //쿠기 유효시간 30분
  }
}));

app.use(express.json({
  limit: '50mb'
}));

app.use(
  // 환경에 따라 다른 인자 적용 - 운영 : combined , 개발 : dev
  // (dev, short, common, combined)
  morgan(process.env.NODE_ENV !== "production" ? "dev" : "combined", {
    // 400 미만의 http code일 때는 스킵
      skip: (req, res) => { return res.statusCode < 400 },
      // 400 이상일 때 로그 출력
      stream
  })
);

const server = app.listen(3001, () => {
  console.log('Server started. port 3001.');
});

//업무화면 로직 처리 라우터 설정
app.use('/', login);
app.use('/', admin);
app.use('/', qna);

/** 여러화면에서 공통적으로 호출하는 화면은 app.js에서 바로 요청처리 **/
//로그아웃
app.post('/api/logout', async (req, res) => {
  req.session.destroy();
  res.send('ok');
});
//파일업로드
app.post('/upload/:fileType/:fileName', async (req, res) => {
  utils.fileUpload(req, res);
});
//에디터에서 이미지 파일업로드
app.post('/ckeditor/images/upload', upload.single('upload'), function(req, res){
  utils.fileCkeditUpload(req, res);
});
//업로드 삭제
app.post('/upload/deleteFile', (req, res) => {
  utils.fileDelete(req, res);
});
//파일 다운로드
app.get('/download/:fileType/:fileName', (req, res) => {
  utils.downloadFile(req, res)
});

module.exports = app;