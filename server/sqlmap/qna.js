module.exports = {
  qnaList: {
    query: `SELECT  
    QNA_SEQ, SUBJECT, WRITER, PUBLIC_YN, LVL
    ,(SELECT MEMBER_NM FROM YS_MEMBER WHERE MEMBER_ID = A.MOD_ID) AS REG_NM
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
    ,DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT      
    ,(SELECT COUNT(1) FROM YS_QNA B WHERE A.PARENT_SEQ = B.PARENT_SEQ) REPLY_CNT
    FROM YS_QNA A
    WHERE A.DEL_YN='N'
    ORDER BY A.PARENT_SEQ DESC, A.LVL ASC`
  },
  qnaInsert: {
    query: `INSERT INTO YS_QNA SET ? , REG_DT = current_timestamp() `
  },
  qnaParentSeq: {
    query: `SELECT IFNULL((MAX(QNA_SEQ)+1),1) AS PARENT_SEQ FROM YS_QNA;`
  },
  qnaInfo: {
    query: `SELECT  
    QNA_SEQ, PARENT_SEQ, SUBJECT, WRITER, PUBLIC_YN, LVL, CONTENTS
    ,(SELECT MEMBER_NM FROM YS_MEMBER WHERE MEMBER_ID = A.MOD_ID) AS REG_NM
    ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
    ,DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT      
    ,(SELECT COUNT(1) FROM YS_QNA B WHERE A.PARENT_SEQ = B.PARENT_SEQ) REPLY_CNT
    ,FILE_NM
    FROM YS_QNA A
    WHERE A.DEL_YN='N'
    AND QNA_SEQ = ? `
  },
  qnaUpdate : {
    query: `UPDATE YS_QNA SET 
            SUBJECT = ?
            , CONTENTS = ?
            , WRITER = ?
            , PASSWORD = ?
            , PUBLIC_YN = ?
            , FILE_NM = ?
            , MOD_ID = ?
            , MOD_DT = current_timestamp()              
            WHERE QNA_SEQ = ? `            
  },
  qnaDelete : {
    query: `UPDATE YS_QNA SET 
            DEL_YN = 'Y'
            , DEL_ID = ?
            , DEL_DT = current_timestamp()              
            WHERE QNA_SEQ = ? `            
  }
}