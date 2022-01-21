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
    //패스워드 항목 암호화 처리
    if(url[2].indexOf("qnaInsert") > -1 ){
      if(!utils.isEmpty(request.body.param[0].PASSWORD)){
        console.log("암호화전 패스워드="+request.body.param[0].PASSWORD);
        //패스워드 암호화 처리
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(request.body.param[0].PASSWORD, salt);
        request.body.param[0].PASSWORD=hash;       
      }
    }    
    //패스워드 항목 암호화 처리    
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
    //리스트요청에서 검색어 검색일때 처리
    if(url[2].indexOf("qnaList") > -1){
      console.log("request.body.param==="+request.body.param)    
      let where = "";
      let whereList = [];                
      let values = [];

      if(!utils.isEmpty(request.body.param)){
          whereList.push(" AND SUBJECT LIKE ? ");
          whereList.push(" OR CONTENTS LIKE ? ");
          values.push("%"+request.body.param+"%");                    
          values.push("%"+request.body.param+"%");
      }else{
          whereList.push(" AND 1=1 ");
          values = [];
      }      
      for(let i=0; i<whereList.length; i++) {
        console.log("whereList[0]==="+whereList[i]);
        where += whereList[i]
      }
      where +=' ORDER BY A.PARENT_SEQ ASC, A.LVL DESC) RN ORDER BY RN.ROWNUM DESC '
      //파라미터 값 제할당
      request.body.param = [];
      request.body.param = values;
      request.body.where = [];      
      request.body.where[0] = where;      
    }

    res.send(await dbcall.db(qna, url[2], request.body.param, request.body.where));
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
};

module.exports = {
  qnaManage: qnaManage
};