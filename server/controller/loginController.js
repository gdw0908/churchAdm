const dbcall = require('../utils/dbconfig');
const bcrypt = require('bcryptjs');
let admin = require('../sqlmap/admin.js');
const fs = require('fs');
fs.watchFile(__dirname + '/sqlmap/admin.js)', (curr, prev) => {
  console.log('login 쿼리 변경시 재시작 없이 반영되도록 함.');
  delete require.cache[require.resolve('../sqlmap/admin.js')];
  admin = require('../sqlmap/admin.js');
});

//Controller 프로그램 로직 구현
let login =async function(request, res){
  try {
    /*let adminInfo = await req.db('adminLogin',[
      request.body.param[0]['admin_id'], request.body.param[1]['admin_pw']
    ] );*/
    let adminInfo = await adminDBCall.db('adminLogin',request.body.param);  
    console.log("adminInfo === "+JSON.stringify(adminInfo));

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

};

//DB 쿼리 호출하는 함수
const adminDBCall = {
  async db(alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbcall.query(admin[alias].query + where, param, (error, rows) => {
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
  login: login
};