module.exports = {
  qnaList: {
    query: 
        `SELECT
            *
          FROM
            (
              SELECT
                @ROWNUM := @ROWNUM + 1 AS ROWNUM
                , ARTICLE_SEQ
                , BOARD_SEQ
                , TITLE
                , CONTS
                , RE_CONTS
                , REG_NM
                , REG_ID
                , PUBLIC_YN
                , STATE
                , DEL_YN
                , VIEW_CNT
                , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
              FROM
                article A
                , (SELECT @ROWNUM := 0) B
              WHERE 1=1
              AND DEL_YN = 'N'
              AND BOARD_SEQ = 1 `
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