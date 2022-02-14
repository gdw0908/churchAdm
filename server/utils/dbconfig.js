
const session = require('express-session');
const {logger}=require('../logger');

const db = {
  database: "christian",
  connectionLimit: 100,
  host: "db.ablesystem.kr" ,
  user: "christian",
  password: "christian"
};

const dbPool = require('mysql').createPool(db);

//DB 쿼리 호출하는 함수
const dbQueryCall = {
  async db(sqlmap, alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbPool.query(sqlmap[alias].query + where, param, (error, rows) => {
      if (error) {
        logger.error("db error!!!!! alias : ["+alias+"] "+error);

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

module.exports=dbQueryCall;