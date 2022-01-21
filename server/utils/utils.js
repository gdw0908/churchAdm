const fs = require('fs');
const gvUpFilePath = `${__dirname}\\upload\\`;
const gvHost = "http://127.0.0.1:3001/";
const multer = require('multer');
const upload = multer({ dest: 'upload/' });

const utils = {};

//함수단위로 모듈화 처리하는 util 파일

// 넘어온 값이 빈값인지 체크. 
// !value 하면 생기는 논리적 오류를 제거하기 위해 
// 명시적으로 value == 사용 // [], {} 도 빈값으로 처리 
utils.isEmpty = function(value){ 
  if( value == "" || value == null || value == undefined 
    || ( value != null && typeof value == "object" && !Object.keys(value).length ) )
    { 
      return true; 
    }else{ 
      return false; 
    } 
};

//ckeditor로 올린 저장까지 안한 이미지 삭제
utils.fileDeleteImage = function(req, files){
  if(files.length > 0){
    for (let key in files){
      //console.log("file path=="+gvFilePath+req.session.files[key]);
      fs.unlink(gvUpFilePath+`\\images\\`+req.session.files[key] ,(err)=>{ 
        console.log(err); 
      });
    }
    req.session.files = new Array; 
  }else{
    return;
  }
}

//ckeditor로 업로드된 이미지 세션 저장 및 리턴 url처리
utils.fileCkeditUpload = function(req, res){
  let downUrl = gvHost+`download/images/`;
  req.session.files.push(req.file.filename);
  console.log("url==="+downUrl+req.file.filename);  
  //리턴 url  
  /*res.send({
    url : downUrl+req.file.filename
  });*/
  res.status(200).send({url : downUrl+req.file.filename});
}

//ckeditor로 올린 저장까지 안한 이미지 삭제
utils.fileDeleteImage = function(req, files){
  if(files.length > 0){
    for (let key in files){
      //console.log("file path=="+gvUpFilePath+req.session.files[key]);
      fs.unlink(gvUpFilePath+`\\images\\`+req.session.files[key] ,(err)=>{ 
        console.log(err); 
      });
    }
    req.session.files = new Array; 
  }else{
    return;
  }
}

//파일 업로드 (일반)
utils.fileUpload = function(req, res){
  let {
    fileType,
    fileName
  } = req.params;
  //const dir = `${__dirname}\\upload\\images`;
  console.log("fileType ===="+`${fileType}`);
  console.log("filenm ===="+`${fileName}`);
  
  const file = gvUpFilePath+`${fileType}\\${fileName}`;
  console.log("file=="+file);
  if (!req.body.data) return fs.unlink(file, async (err) => res.send({
    err
  }));
  const data = req.body.data.slice(req.body.data.indexOf(';base64,') + 8);
  if (!fs.existsSync(gvUpFilePath+`${fileType}`)) fs.mkdirSync(gvUpFilePath+`${fileType}`);
  fs.writeFile(file, data, 'base64', async (error) => {

    if (error) {
      res.send({
        error
      });
    } else {
      res.send("ok");
    }
  }); 
}

//업로드된 물리 파일 삭제
utils.fileDelete = function(req, res){
  console.log("파일 삭제1==="+req.body.param[0]);
  console.log("파일 삭제2==="+req.body.param[1]);
  let filetype = req.body.param[1];
  let files = req.body.param[0];
  if(files.length > 0){
    for (let key in files){
      fs.unlink(gvUpFilePath+filetype+`\\`+files[key] ,(err)=>{ 
        console.log(err); 
      });
    }
    res.send("ok");
  }else{
    res.send("ok");
  }
}

//파일 업로드
utils.downloadFile = function(req, res){
  const {
    fileType,
    fileName
  } = req.params;
  const filepath = gvUpFilePath+`${fileType}\\${fileName}`;
  console.log("download filepath==="+filepath);
  res.header('Content-Type', `file`);
  if (!fs.existsSync(filepath)){ 
    res.status(404).send({error: 'Can not found file.'});
  }
  else fs.createReadStream(filepath).pipe(res);
}

module.exports = utils;