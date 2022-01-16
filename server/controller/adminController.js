const dbcall = require('../utils/dbconfig');
const bcrypt = require('bcryptjs');
const fs = require('fs');

let admin = require('../sqlmap/admin.js');
fs.watchFile(__dirname + '/sqlmap/admin.js)', (curr, prev) => {
  console.log('admin 쿼리 변경시 재시작 없이 반영되도록 함.');
  delete require.cache[require.resolve('../sqlmap/admin.js')];
  admin = require('../sqlmap/admin.js');
});

//Controller 로직 구현
let adminManage =async function(request, res){
  console.log("여기는 왜안타냐??"+request.url);
  let url = request.url.split('/');
  console.log("url=="+url[1]);
  if (!request.session.adminId) {
    return res.status(401).send({
      error: 'You need to login.'
    });
  }
  try {
    if(request.url.indexOf("adminInsert") > -1 ||
        request.url.indexOf("adminUpdate") > -1){
      console.log("암호화전 패스워드="+request.body.param[0].member_pw);
      //패스워드 암호화 처리
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(request.body.param[0].member_pw, salt);
      request.body.param[0].member_pw=hash;       
      //console.log("암호화후 패스워드=="+request.body.param[0].member_pw);
    }
    res.send(await adminDBCall.db(url.split('/')[1], request.body.param, request.body.where));
  } catch (err) {
    res.status(500).send({
      error: err
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
  adminManage: adminManage
};