
const session = require('express-session');

const db = {
  database: "churchdb",
  connectionLimit: 100,
  host: "52.78.137.106" ,
  user: "churchdb",
  password: "churchdb!!11"
};

const dbPool = require('mysql').createPool(db);

module.exports=dbPool;