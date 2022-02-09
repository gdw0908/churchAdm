module.exports = {
  adminLogin: {
    query: `SELECT *
    FROM church_staff
    WHERE MEMBER_ID = ? `,
  },
  adminList: {
    query: ` SELECT * 
    FROM 
      (SELECT 
      @ROWNUM := @ROWNUM + 1 AS ROWNUM
      ,CHURCH_STAFF_SEQ, MEMBER_ID, MEMBER_NM, EMAIL
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      FROM church_staff, (SELECT @ROWNUM :=0) TMP
      WHERE DEL_YN='N'
    `,
  },
  idDupleChk: {
    query: `SELECT  
    COUNT(1) AS idCnt
    FROM church_staff
    WHERE MEMBER_ID = ? 
    AND   DEL_YN = 'N' `,
  },
  adminInsert: {
    query: `INSERT church_staff SET ? , REG_DT = current_timestamp()`,
  },
  adminDelete: {
    query: `UPDATE church_staff 
            SET 
            DEL_YN = 'Y'
            ,DEL_DT = current_timestamp()
            ,DEL_ID = ?
            WHERE MEMBER_ID = ? `,
  },
  adminInfo: {
    query: `SELECT  
    CHURCH_STAFF_SEQ, MEMBER_ID, MEMBER_NM, EMAIL
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
    FROM church_staff
    WHERE DEL_YN='N'
    AND MEMBER_ID = ? `,
  },
  adminUpdate: {
    query: `UPDATE church_staff SET ?
            , MOD_DT = current_timestamp()
            , MOD_ID = ?
            WHERE MEMBER_ID = ? `,
  },
}
