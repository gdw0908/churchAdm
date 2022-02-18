module.exports = {
    noticeList: {
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
                        , A.VIEW_CNT
                        , A.NOTICE_YN
                        , A.PUBLIC_YN
                        , A.DEL_YN
                        , (SELECT CHURCH_NM FROM church_staff WHERE MEMBER_ID = A.REG_ID) AS REG_NM
                        , DATE_FORMAT(A.REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                        , DATE_FORMAT(A.MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
                    FROM  
                        article A
                        JOIN church_staff C
                        ON A.REG_ID = C.MEMBER_ID
                        , (SELECT @ROWNUM := 0) RN
                    WHERE 1=1
                    AND A.BOARD_SEQ = 3 
                    AND A.DEL_YN = 'N'
		    `
    },
    noticeInfo:{
        query:
           `SELECT
                  ARTICLE_SEQ
                , TITLE
                , CONTS
                , PUBLIC_YN
                , DEL_YN
                , (SELECT MEMBER_NM FROM church_member WHERE MEMBER_ID = A.REG_ID) AS REG_NM
                , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                , DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
            FROM 
                article A
            WHERE A.board_seq = 3
            AND DEL_YN = 'N'
            AND ARTICLE_SEQ = ? `
    },
    noticeInsert: {
        query: `INSERT INTO article SET ?
                    , BOARD_SEQ = 3 
                    , REG_DT = current_timestamp()`
    },
    noticeUpdate: {
        query:
            `UPDATE article SET 
                  TITLE = ?
                , CONTS = ?
                , PUBLIC_YN = ?
                , MOD_ID = ?
                , MOD_DT = current_timestamp()
            WHERE ARTICLE_SEQ = ?`
    },
    noticeDelete: {
        query: `UPDATE article SET 
                      DEL_YN = 'Y'
                    , DEL_ID = ?
                    , DEL_DT = current_timestamp()
                WHERE ARTICLE_SEQ = ?`
    }
}