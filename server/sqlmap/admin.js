module.exports = {

  adminLogin: {
    query: `SELECT MEMBER_SEQ, MEMBER_ID, MEMBER_NM, GROUP_SEQ, EMAIL, MEMBER_PW
    FROM YS_MEMBER
    WHERE MEMBER_ID = ? `
  },
  adminList: {
    query: ` SELECT * 
    FROM 
      (SELECT 
      @ROWNUM := @ROWNUM + 1 AS ROWNUM
      ,MEMBER_SEQ, MEMBER_ID, MEMBER_NM, GROUP_SEQ, EMAIL
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      FROM YS_MEMBER, (SELECT @ROWNUM :=0) TMP
      WHERE DEL_YN='N'
      ORDER BY REG_DT ASC) RN
    ORDER BY RN.ROWNUM DESC `
  },
  idDupleChk: {
    query: `SELECT  
    COUNT(1) AS idCnt
    FROM YS_MEMBER
    WHERE MEMBER_ID = ? 
    AND   DEL_YN = 'N' `
  },
  adminInsert: {
    query: `INSERT YS_MEMBER SET ? , REG_DT = current_timestamp()`
  },    
  adminDelete: {
    query: `UPDATE YS_MEMBER 
            SET 
            DEL_YN = 'Y'
            ,DEL_DT = current_timestamp()
            ,DEL_ID = ?
            WHERE MEMBER_ID = ? `            
  },
  adminInfo: {
    query: `SELECT  
    MEMBER_SEQ, MEMBER_ID, MEMBER_NM, GROUP_SEQ, EMAIL
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
    FROM YS_MEMBER
    WHERE DEL_YN='N'
    AND MEMBER_ID = ? `
  },
  adminUpdate : {
    query: `UPDATE YS_MEMBER SET ?
            , MOD_DT = current_timestamp()
            , MOD_ID = ?
            WHERE MEMBER_ID = ? `            
  }
  
}