module.exports = {

  adminLogin: {
    query: `SELECT MEMBER_SEQ, MEMBER_ID, MEMBER_NM,  EMAIL, MEMBER_PW
    FROM MEMBER
    WHERE MEMBER_ID = ? `
  },
  adminList: {
    query: ` SELECT * 
    FROM 
      (SELECT 
      @ROWNUM := @ROWNUM + 1 AS ROWNUM
      ,MEMBER_SEQ, MEMBER_ID, MEMBER_NM,  EMAIL
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      FROM MEMBER, (SELECT @ROWNUM :=0) TMP
      WHERE DEL_YN='N'
    `
  },
  idDupleChk: {
    query: `SELECT  
    COUNT(1) AS idCnt
    FROM MEMBER
    WHERE MEMBER_ID = ? 
    AND   DEL_YN = 'N' `
  },
  adminInsert: {
    query: `INSERT MEMBER SET ? , REG_DT = current_timestamp()`
  },    
  adminDelete: {
    query: `UPDATE MEMBER 
            SET 
            DEL_YN = 'Y'
            ,DEL_DT = current_timestamp()
            ,DEL_ID = ?
            WHERE MEMBER_ID = ? `            
  },
  adminInfo: {
    query: `SELECT  
    MEMBER_SEQ, MEMBER_ID, MEMBER_NM,  EMAIL
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
    FROM MEMBER
    WHERE DEL_YN='N'
    AND MEMBER_ID = ? `
  },
  adminUpdate : {
    query: `UPDATE MEMBER SET ?
            , MOD_DT = current_timestamp()
            , MOD_ID = ?
            WHERE MEMBER_ID = ? `            
  }
  
}