module.exports = {
  adminLogin: {
    query: `SELECT *
    FROM church_staff
    WHERE MEMBER_ID = ? `,
  },
  memberList: {
    query: ` SELECT * 
    FROM 
      (SELECT 
      @ROWNUM := @ROWNUM + 1 AS ROWNUM
      ,MEMBER_SEQ, MEMBER_ID, MEMBER_NM, EMAIL,CHURCH_NM,CELL,BIRTHDAY AS BIRTH,GENDER,MEMBER_CODE
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT  
      FROM church_member, (SELECT @ROWNUM :=0) TMP
      WHERE DEL_YN='N' AND MEMBER_CODE = ?
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
  memberUpdate: {
    query: `UPDATE church_member SET ?
            , MOD_DT = current_timestamp()
            WHERE MEMBER_ID = ? `,
  },
  memberDelete: {
    query: `UPDATE church_member 
            SET 
            DEL_YN = 'Y'
            ,DEL_DT = current_timestamp()
            ,DEL_ID = ?
            WHERE MEMBER_ID = ? `,
  },
  memberInfo: {
    query: `SELECT  
    MEMBER_SEQ, MEMBER_ID, MEMBER_NM, EMAIL,CELL,BIRTHDAY, MEMBER_PW
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT ,CHURCH_NM, MEMBER_CODE, GENDER
    FROM church_member
    WHERE DEL_YN='N'
    AND MEMBER_ID = ? `,
  },
  adminUpdate: {
    query: `UPDATE church_staff SET ?s
            , MOD_DT = current_timestamp()
            WHERE MEMBER_ID = ? `,
  },
  code_insert: {
    query: `INSERT INTO common_code (CODE_NM, CODE_GROUP_SEQ, REG_DT) VALUES(?,'7',current_timestamp())`,
  },
  code_select: {
    query: `SELECT MEMBER_CODE FROM church_member WHERE MEMBER_ID = ? `,
  },
}
