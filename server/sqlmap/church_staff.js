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
      ,CHURCH_STAFF_SEQ, MEMBER_ID, MEMBER_NM, EMAIL,CHURCH_NM,CHURCH_CELL,LOCATION,MEMBER_CELL,CODE
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT      
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
    CHURCH_STAFF_SEQ, MEMBER_ID, MEMBER_NM, EMAIL, CHURCH_CELL,MEMBER_CELL
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
    FROM church_staff
    WHERE DEL_YN='N'
    AND MEMBER_ID = ? `,
  },
  adminUpdate: {
    query: `UPDATE church_staff SET ?
            , MOD_DT = current_timestamp()
            WHERE MEMBER_ID = ? `,
  },
  code_insert: {
    query: `INSERT INTO common_code (CODE_NM, CODE_GROUP_SEQ, REG_DT) VALUES(?,'7',current_timestamp())`,
  },
  code_select: {
    query: `SELECT CODE_SEQ AS CODE FROM common_code ORDER BY REG_DT DESC LIMIT 1`,
  },
}
