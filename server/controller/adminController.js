const dbcall = require('../utils/dbconfig');
const bcrypt = require('bcryptjs');
const fs = require('fs');
let admin = require('../sqlmap/admin.js');


//Controller 로직 구현
let adminManage =async function(request, res){
  let url = request.url.split('/');
  console.log("url=="+url[2]);
  console.log("request.session.adminId=="+request.session.adminId);
  if (!request.session.adminId) {
    return res.status(401).send({
      error: 'You need to login.'
    });
  }
  try {
    if(url[2].indexOf("adminInsert") > -1 ||
        url[2].indexOf("adminUpdate") > -1){
      console.log("암호화전 패스워드="+request.body.param[0].member_pw);
      //패스워드 암호화 처리
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(request.body.param[0].member_pw, salt);
      request.body.param[0].member_pw=hash;       
      //console.log("암호화후 패스워드=="+request.body.param[0].member_pw);
    }
    res.send(await adminDBCall.db(url[2], request.body.param, request.body.where));
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