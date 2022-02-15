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
                        , (SELECT CHURCH_NM FROM church_member WHERE MEMBER_ID = A.REG_ID) AS CHURCH_NM
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
                ,	(
                        SELECT 
                            (SELECT COUNT(*) FROM article_re WHERE DEL_YN = 'N' AND ARTICLE_SEQ = ?) +
                            (SELECT COUNT(*) FROM big_article_re WHERE DEL_YN = 'N' AND ARTICLE_SEQ = ?) 
                        AS COUNT
                    ) AS COUNT
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
            UPDATE 
                  article A
                , article_re B
            SET 
                  A.DEL_YN = 'Y'
                , A.DEL_ID = ?
                , A.DEL_DT = current_timestamp()
                , B.DEL_YN = 'Y'      
            WHERE A.article_seq = B.article_seq
            AND A.ARTICLE_SEQ = ?
            `
    },
    freeboardComment:{
        query:`SELECT 
                      REG_ID
                    , REG_NM 
                    , RE_CONTS
                    , ARTICLE_REPLY_SEQ
                    , ARTICLE_SEQ
                    , DATE_FORMAT(REG_DT, '%Y.%m.%d') AS REG_DT
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
            UPDATE 
                  article_re A
                , big_article_re B
            SET
                  A.DEL_YN = 'Y'
                , B.DEL_YN = 'Y'
            WHERE A.ARTICLE_REPLY_SEQ = B.ARTICLE_REPLY_SEQ 
            AND A.ARTICLE_REPLY_SEQ = ?
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
                , DATE_FORMAT(REG_DT, '%Y.%m.%d') AS REG_DT
            FROM 
                big_article_re
            WHERE BOARD_SEQ = 4
            AND DEL_YN = 'N'
            AND ARTICLE_SEQ = ?
            ORDER BY REG_DT ASC
            `
    },
    bigDelete:{
        query:
            `
            UPDATE 
                big_article_re
            SET
                DEL_YN = 'Y'
            WHERE BIG_ARTICLE_SEQ = ?
            `
    }

}