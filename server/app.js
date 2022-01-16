const express = require('express');
const morgan = require('morgan');
const { stream } = require('./winston')();

const app = express();
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({ dest: 'upload/images/' });
const gvFilePath = `${__dirname}\\upload\\`;
const gvHost = "http://127.0.0.1:3001/";
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

let sql = require('./sql.js');

fs.watchFile(__dirname + '/sql.js', (curr, prev) => {
  console.log('sql 변경시 재시작 없이 반영되도록 함.');
  delete require.cache[require.resolve('./sql.js')];
  sql = require('./sql.js');
});

const db = {
  database: "churchdb",
  connectionLimit: 100,
  host: "52.78.137.106" ,
  user: "churchdb",
  password: "churchdb!!11"
};

const dbPool = require('mysql').createPool(db);

app.post('/api/adminLogin', async (request, res) => {
  try {
    /*let adminInfo = await req.db('adminLogin',[
      request.body.param[0]['admin_id'], request.body.param[1]['admin_pw']
    ] );*/
    console.log("process.env.NODE_ENV=="+process.env.NODE_ENV);
    let adminInfo = await req.db('adminLogin',request.body.param);
    if(adminInfo.length > 0){
      if (request.body.param.length > 0) {
        //for (let key in request.body.param[0]) {
          console.log("로그인 ID=="+request.body.param[0]);
          console.log("로그인 ID=="+request.sessionID);
          //request.session[key] = request.body.param[0][key];  
          request.session.adminId = request.body.param[0];  //관리자 ID만 세션셋팅
          request.session.files = new Array;
          const validPassword = await bcrypt.compare(request.body.param[1], adminInfo[0].MEMBER_PW);
          console.log("pass compare == "+validPassword);
          if (!validPassword) {
            res.send({
              error: "로그인 실패."
            });
            return;
          }
        //}
        res.send(adminInfo);
      } else {
        res.send({
          error: "Please try again or contact system manager."
        });
      }
    }else{
      res.send({
        error: "로그인 실패."
      });
    }
  } catch (err) {
    res.send({
      error: "DB access error"
    });
  }
});

app.post('/apirole/:alias', async (request, res) => {
  console.log("request.session=="+request.session.adminId);
  console.log("request.sessionID=="+request.sessionID);
  console.log("request.params.alias=="+request.params.alias);

  if (!request.session.adminId) {
    return res.status(401).send({
      error: 'You need to login.'
    });
  }
  try {
    if(request.params.alias.indexOf("adminInsert") > -1 ||
        request.params.alias.indexOf("adminUpdate") > -1){
      console.log("암호화전 패스워드="+request.body.param[0].member_pw);
      //패스워드 암호화 처리
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(request.body.param[0].member_pw, salt);
      request.body.param[0].member_pw=hash;       
      //console.log("암호화후 패스워드=="+request.body.param[0].member_pw);
    }
    if(request.params.alias.indexOf("qnaInsert") > -1 ){
        if(!isEmpty(request.body.param[0].PASSWORD)){
          console.log("암호화전 패스워드="+request.body.param[0].PASSWORD);
          //패스워드 암호화 처리
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(request.body.param[0].PASSWORD, salt);
          request.body.param[0].PASSWORD=hash;       
        }
    }        
    if(request.params.alias.indexOf("qnaUpdate") > -1){
      if(!isEmpty(request.body.param[3])){
        console.log("암호화전 패스워드="+request.body.param[3]);
        //패스워드 암호화 처리
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(request.body.param[3], salt);
        request.body.param[3]=hash;       
      }
    }

    if( request.params.alias.indexOf("qnaInsert") > -1 ||
        request.params.alias.indexOf("qnaUpdate") > -1){
      request.session.files = new Array; //에디터로 올린 이미지 정보 세션에서 삭제
    }else{
      if(request.session.files.length > 0){
        console.log("저장안한 파일 삭제 요청");
        fileDeleteImage(request, request.session.files);
      }
    }
    res.send(await req.db(request.params.alias, request.body.param, request.body.where));

  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});


app.post('/api/logout', async (request, res) => {
  request.session.destroy();
  res.send('ok');
});

app.post('/upload/:fileType/:fileName', async (request, res) => {
  let {
    fileType,
    fileName
  } = request.params;
  //const dir = `${__dirname}\\upload\\images`;
  console.log("fileType ===="+`${fileType}`);
  console.log("filenm ===="+`${fileName}`);
  
  const file = gvFilePath+`${fileType}\\${fileName}`;
  console.log("file=="+file);
  if (!request.body.data) return fs.unlink(file, async (err) => res.send({
    err
  }));
  const data = request.body.data.slice(request.body.data.indexOf(';base64,') + 8);
  if (!fs.existsSync(gvFilePath+`${fileType}`)) fs.mkdirSync(gvFilePath+`${fileType}`);
  fs.writeFile(file, data, 'base64', async (error) => {

    if (error) {
      res.send({
        error
      });
    } else {
      res.send("ok");
    }
  });
});

app.post('/ckeditor/images/upload', upload.single('upload'), function(req, res){
  let downUrl = gvHost+`download/images/`;
  req.session.files.push(req.file.filename);
  console.log("request.files=="+req.session.files.length);  
  console.log("url==="+downUrl+req.file.filename);  
  //리턴 url  
  res.send({
    url : downUrl+req.file.filename
  });
});

app.post('/upload/deleteFile', (request, res) => {
  console.log("파일 삭제1==="+request.body.param[0]);
  console.log("파일 삭제2==="+request.body.param[1]);
  let filetype = request.body.param[1];
  let files = request.body.param[0];
  if(files.length > 0){
    for (let key in files){
      fs.unlink(gvFilePath+filetype+`\\`+files[key] ,(err)=>{ 
        console.log(err); 
      });
    }
    res.send("ok");
  }else{
    res.send("ok");
  }
});

app.get('/download/:fileType/:fileName', (request, res) => {
  const {
    fileType,
    fileName
  } = request.params;
  const filepath = `${__dirname}\\upload\\${fileType}\\${fileName}`;
  res.header('Content-Type', `file`);
  if (!fs.existsSync(filepath)) res.send(404, {
    error: 'Can not found file.'
  });
  else fs.createReadStream(filepath).pipe(res);
});

//ckeditor로 올린 저장까지 안한 이미지 삭제
function fileDeleteImage(req, files){
  if(files.length > 0){
    for (let key in files){
      //console.log("file path=="+gvFilePath+req.session.files[key]);
      fs.unlink(gvFilePath+`\\images\\`+req.session.files[key] ,(err)=>{ 
        console.log(err); 
      });
    }
    req.session.files = new Array; 
  }else{
    return;
  }
}

// 넘어온 값이 빈값인지 체크. 
// !value 하면 생기는 논리적 오류를 제거하기 위해 
// 명시적으로 value == 사용 // [], {} 도 빈값으로 처리 
var isEmpty = function(value){ 
  if( value == "" || value == null || value == undefined 
    || ( value != null && typeof value == "object" && !Object.keys(value).length ) )
    { 
      return true; 
    }else{ 
      return false; 
    } 
};

