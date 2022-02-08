module.exports = {
    freeboardList: {
        query:
            `
            SELECT 
                *
            FROM 
                (
                    SELECT 
                        @ROWNUM := @ROWNUM + 1 AS ROWNUM
                        , ARTICLE_SEQ
                        , BOARD_SEQ
                        , TITLE
                        , CONTS
                        , REG_NM
                        , REG_ID
                        , PUBLIC_YN
                        , DEL_YN
                        , VIEW_CNT
                        , DATE_FORMAT (REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                        , DATE_FORMAT (MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
                    FROM 
                        article A
                        , (SELECT @ROWNUM := 0) B
                    WHERE 1=1
                    AND BOARD_SEQ = 4
                    AND DEL_YN = 'N'
            `
    },
    freeboardDetail: {
        query:`        
        SELECT
                  ARTICLE_SEQ
                , BOARD_SEQ
                , TITLE
                , CONTS
                , REG_NM
                , VIEW_CNT
                , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                , DEL_YN
            FROM
                article
            WHERE 1=1
            AND DEL_YN = 'N'
            AND BOARD_SEQ = 4
            AND ARTICLE_SEQ = ?
            `
    },
    freeboardComment:{
        query:`SELECT
                    A.ARTICLE_REPLY_SEQ
                , A.ARTICLE_SEQ
                , A.BOARD_SEQ
                , A.RE_CONTS
                , A.REG_ID
                , B.ARTICLE_REPLY_SEQ
                , B.ARTICLE_SEQ
                , B.BIG_RE_CONTS
            FROM 
                article_re A
                JOIN big_article_re B
                ON A.ARTICLE_REPLY_SEQ = B.ARTICLE_REPLY_SEQ
            WHERE 1=1
            AND A.BOARD_SEQ = 4
            AND A.DEL_YN = 'N'`
    },
    freeboardDelete: {
        query:
            `
            UPDATE article SET 
                  DEL_YN = 'Y'
                , DEL_ID = ?
                , DEL_DT = current_timestamp()              
            WHERE ARTICLE_SEQ = ? 
            `
    }

}