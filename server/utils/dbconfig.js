
const session = require('express-session');

const db = {
  database: "churchdb",
  connectionLimit: 100,
  host: "3.34.147.50" ,
  user: "churchdb",
  password: "churchdb!!11"
};

const dbPool = require('mysql').createPool(db);

//DB 쿼리 호출하는 함수
const dbQueryCall = {
  async db(sqlmap, alias, param = [], where = '') {
    return new Promise((resolve, reject) => dbPool.query(sqlmap[alias].query + where, param, (error, rows) => {
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

module.exports=dbQueryCall;