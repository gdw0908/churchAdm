const dbcall = require('../utils/dbconfig');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const utils = require('../utils/utils');
let qna = require('../sqlmap/qna.js');

//Controller 로직 구현
let qnaManage =async function(request, res){
  let url = request.url.split('/');
  console.log("url=="+url[2]);
  console.log("request.session.adminId=="+request.session.adminId);
  if (!request.session.adminId) {
    return res.status(401).send({
      error: 'You need to login.'
    });
  }
  try {
    if(url[2].indexOf("qnaInsert") > -1 ){
      if(!utils.isEmpty(request.body.param[0].PASSWORD)){
        console.log("암호화전 패스워드="+request.body.param[0].PASSWORD);
        //패스워드 암호화 처리
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(request.body.param[0].PASSWORD, salt);
        request.body.param[0].PASSWORD=hash;       
      }
  }        
  if(url[2].indexOf("qnaUpdate") > -1){
    if(!utils.isEmpty(request.body.param[3])){
      console.log("암호화전 패스워드="+request.body.param[3]);
      //패스워드 암호화 처리
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(request.body.param[3], salt);
      request.body.param[3]=hash;       
    }
  }

  if( url[2].indexOf("qnaInsert") > -1 ||
      url[2].indexOf("qnaUpdate") > -1){
    request.session.files = new Array; //에디터로 올린 이미지 정보 세션에서 삭제
  }else{
    if(request.session.files.length > 0){
      console.log("저장안한 파일 삭제 요청");
      utils.fileDeleteImage(request, request.session.files);
    }
  }
    res.send(await qnaDBCall.db(url[2], request.body.param, request.body.where));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }

};

//DB 쿼리 호출하는 함수
const qnaDBCall = {
  async db(alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbcall.query(qna[alias].query + where, param, (error, rows) => {
      if (error) {
        console.log("db error====!!!!!"+error);
        resolve({
          error
        });
        throw error;
      } else { 
        resolve(rows);
      }
    }));
  }
};

module.exports = {
  qnaManage: qnaManage
};