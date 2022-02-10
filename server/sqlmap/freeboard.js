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
    freeboardDelete: {
        query:
            `
            UPDATE article SET 
                  DEL_YN = 'Y'
                , DEL_ID = ?
                , DEL_DT = current_timestamp()              
            WHERE ARTICLE_SEQ = ? 
            `
    },
    freeboardComment:{
        query:`SELECT 
                      REG_ID
                    , REG_NM 
                    , RE_CONTS
                    , ARTICLE_REPLY_SEQ
                    , ARTICLE_SEQ
                    ,	(
                            SELECT 
                                COUNT(*) 
                            FROM 
                                ARTICLE_RE 
                            WHERE BOARD_SEQ = 4 
                            AND ARTICLE_SEQ = ?
                            AND ARTICLE_REPLY_SEQ = ARTICLE_REPLY_SEQ
                        ) AS COUNT
                    , CAST(DATE_FORMAT(REG_DT, '%Y.%m.%d') AS CHAR) AS REG_DT
                FROM 
                    ARTICLE_RE 
                WHERE BOARD_SEQ = 4
                AND DEL_YN = 'N'
                AND ARTICLE_SEQ = ?
                ORDER BY REG_DT ASC `
    },
    commentDelete:{
        query:
            `
            UPDATE article_re SET
                  DEL_YN = 'Y'
            WHERE ARTICLE_REPLY_SEQ = ?
            `
    },
    bigComment:{
        query:
            `
            SELECT 
                  REG_ID
                , REG_NM
                , BIG_RE_CONTS
                , BIG_ARTICLE_SEQ
                , ARTICLE_REPLY_SEQ
                , CAST(DATE_FORMAT(REG_DT, '%Y.%m.%d') AS CHAR) AS REG_DT
            FROM 
                big_article_re
            WHERE BOARD_SEQ = 4
            AND DEL_YN = 'N'
            AND ARTICLE_SEQ = ?
            ORDER BY REG_DT ASC
            `
    }

}