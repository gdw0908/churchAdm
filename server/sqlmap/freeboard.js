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
        qurey:
            `
            SELECT
                *
            FROM
                article
            WHERE 1=1
            AND DEL_YN = 'N'
            AND BOARD_SEQ = 4
            AND ARTICLE_SEQ = ?
            `
    }

}