const dbcall = require('../utils/dbconfig');
const utils = require('../utils/utils');
let freeboard = require('../sqlmap/freeboard.js');
const {logger}=require('../logger')

//Controller 로직 구현
let freeboardManage =async function(request, res){
  let url = request.url.split('/');
  console.log("url=="+url[2]);
  //console.log("request.session.adminId=="+request.session.adminId);
  if (!request.session.adminId) {
    return res.status(401).send({
      error: 'You need to login.'
    });
  }
  try {

    if( url[2].indexOf("freeboardInsert") > -1 ||
        url[2].indexOf("freeboardUpdate") > -1){
      request.session.files = new Array; //에디터로 올린 이미지 정보 세션에서 삭제
    }
    //리스트요청에서 검색어 검색일때 처리
    if(url[2].indexOf("freeboardList") > -1){
      console.log("request.body.param[1] === " + request.body.param[1])    
      let where = '';
      let whereList = [];                
      let values = [];

      if(!utils.isEmpty(request.body.param[0])){
          whereList.push(' AND (A.TITLE LIKE ? ');
          whereList.push(' OR A.CONTS LIKE ? )');
          values.push('%'+request.body.param[0]+'%');                    
          values.push('%'+request.body.param[0]+'%');

          //검색할때 교회코드 호출
          if (!(request.body.param[1] == 1)) {
            console.log('자유게시판 코드번호')
            whereList.push(' AND C.MEMBER_CODE = ? ')
            values.push(request.body.param[1])
          }
      }else{
          whereList.push(' AND 1=1 ');
          if (!(request.body.param[1] == 1)) {
            console.log('자유게시판 코드번호')
            whereList.push(' AND C.MEMBER_CODE = ? ')
            values.push(request.body.param[1])
          }
      }      
      for(let i=0; i<whereList.length; i++) {
        //console.log("whereList[0]==="+whereList[i]);
        where += whereList[i]
      }
      where += ') RN ORDER BY RN.ROWNUM DESC' 
        
      //파라미터 값 제할당
      request.body.param = [];
      request.body.param = values;
      request.body.where = [];      
      request.body.where[0] = where;      
    }

    console.log(JSON.stringify(request.body.param));
    res.send(await dbcall.db(freeboard, url[2], request.body.param, request.body.where));
    } catch (err) {
      res.status(500).send({
        error: err
      });
    }
};

module.exports = {
  freeboardManage: freeboardManage
};