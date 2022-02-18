module.exports = {
  qnaList: {
    query: 
        `SELECT
            *
          FROM
            (
              SELECT
                @ROWNUM := @ROWNUM + 1 AS ROWNUM
                , A.ARTICLE_SEQ
                , A.BOARD_SEQ
                , A.TITLE
                , A.CONTS
                , A.RE_CONTS
                , A.REG_NM
                , A.REG_ID
                , A.PUBLIC_YN
                , A.STATE
                , A.DEL_YN
                , A.VIEW_CNT
                , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
              FROM
                article A
                JOIN church_member C
	              ON A.REG_ID = C.MEMBER_ID
                , (SELECT @ROWNUM := 0) B
              WHERE 1=1
              AND A.DEL_YN = 'N'
              AND A.BOARD_SEQ = 1 `
  },
  qnaInsert: {
    query: `INSERT INTO article SET ? 
                  , BOARD_SEQ = 1
                  , REG_DT = current_timestamp() `
  },
  qnaInfo: {
    query: 
        `SELECT
              ARTICLE_SEQ
            , TITLE
            , CONTS
            , RE_CONTS
            , PUBLIC_YN
            , DEL_YN
            , REG_NM
            , REG_ID
            , VIEW_CNT
            , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
            , DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
          FROM
          article
          WHERE BOARD_SEQ = 1
          AND DEL_YN = 'N'
          AND ARTICLE_SEQ = ? `
  },
  qnaUpdate : {
    query: `UPDATE article SET 
              TITLE = ?
            , CONTS = ?
            , REG_NM = ?
            , PASSWORD = ?
            , PUBLIC_YN = ?
            , MOD_ID = ?
            , MOD_DT = current_timestamp()              
            WHERE ARTICLE_SEQ = ? `            
  },
  qnaDelete : {
    query: `UPDATE article SET 
              DEL_YN = 'Y'
            , DEL_ID = ?
            , DEL_DT = current_timestamp()              
            WHERE ARTICLE_SEQ = ? `            
  },
  qnaParentSeq: {
    query :`SELECT IFNULL((MAX(ARTICLE_SEQ)+1),1) AS PARENT_SEQ FROM article`
  },
  qnaComment : {
    query: `UPDATE article SET 
              TITLE = ?
            , RE_CONTS = ?
            , REG_NM = ?
            , PASSWORD = ?
            , PUBLIC_YN = ?
            , STATE = 1
            , MOD_ID = ?
            , MOD_DT = current_timestamp()              
            WHERE ARTICLE_SEQ = ? `            
  }
}