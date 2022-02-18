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
                        , A.ARTICLE_SEQ
                        , A.BOARD_SEQ
                        , A.TITLE
                        , A.CONTS
                        , A.REG_NM
                        , A.REG_ID
                        , A.PUBLIC_YN
                        , A.DEL_YN
                        , A.VIEW_CNT
                        , (SELECT CHURCH_NM FROM church_member WHERE MEMBER_ID = A.REG_ID) AS CHURCH_NM
                        , DATE_FORMAT (A.REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                        , DATE_FORMAT (A.MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
                    FROM 
                        article A
                        JOIN church_member C
                        ON A.REG_ID = C.MEMBER_ID
                        , (SELECT @ROWNUM := 0) RN
                    WHERE 1=1
                    AND A.BOARD_SEQ = 4
                    AND A.DEL_YN = 'N'
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
            UPDATE article A
                LEFT JOIN article_re B 
                ON (A.article_seq = B.article_seq)
                LEFT JOIN big_article_re C
                ON (A.article_seq = C.article_seq)
            SET 
                  A.DEL_YN = 'Y'
                , A.DEL_ID = ?
                , A.DEL_DT = current_timestamp()
                , B.DEL_YN = 'Y'
                , C.DEL_YN = 'Y'
            WHERE A.ARTICLE_SEQ = ?
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
                LEFT JOIN big_article_re B
                ON (A.ARTICLE_REPLY_SEQ = B.ARTICLE_REPLY_SEQ)
            SET
                  A.DEL_YN = 'Y'
                , B.DEL_YN = 'Y'
            WHERE A.ARTICLE_REPLY_SEQ = ?
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