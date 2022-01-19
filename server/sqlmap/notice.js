module.exports = {
    noticeList: {
        query:
            `SELECT
                *
            FROM
                (
                    SELECT 
                        @ROWNUM := @ROWNUM + 1 AS ROWNUM
                        , NOTICE_SEQ
                        , SUBJECT
                        , WRITER
                        , PUBLIC_YN
                        , (SELECT MEMBER_NM FROM YS_MEMBER WHERE MEMBER_ID = A.MOD_ID) AS REG_NM
                        , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
                        , DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
                    FROM
                          NOTICE A
                        , (SELECT @ROWNUM :=0) TMP
                    WHERE A.DEL_YN = 'N'
                ) RN
            ORDER BY RN.ROWNUM DESC`
    },
    noticeInfo:{
        query: `SELECT
                      NOTICE_SEQ
                    , SUBJECT
                    , WRITER
                    , PUBLIC_YN
                    , CONTENTS
                    , (SELECT MEMBER_NM FROM YS_MEMBER WHERE MEMBER_ID = A.MOD_ID) AS REG_NM
                    , DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT
                    , DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT
                    , FILE_NM
                FROM NOTICE A
                WHERE A.DEL_YN = 'N'
                AND NOTICE_SEQ = ? `
    },
    noticeInsert: {
        query: `INSERT INTO NOTICE SET ?, REG_DT = current_timestamp()`
    },
    noticeUpdate: {
        query:
            `UPDATE NOTICE SET 
                  SUBJECT = ?
                , CONTENTS = ?
                , WRITER = ?
                , PUBLIC_YN = ?
                , FILE_NM = ?
                , MOD_ID = ?
                , MOD_DT = current_timestamp()
            WHERE NOTICE_SEQ = ?`
    },
    noticeDelete: {
        query: `UPDATE NOTICE SET 
                      DEL_YN = 'Y'
                    , DEL_ID = ?
                    , DEL_DT = current_timestamp()
                WHERE NOTICE_SEQ = ?`
    }
}