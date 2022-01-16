module.exports = {

    adminLogin: {
      query: `SELECT MEMBER_SEQ, MEMBER_ID, MEMBER_NM, GROUP_SEQ, EMAIL, MEMBER_PW
      FROM YS_MEMBER
      WHERE MEMBER_ID = ? `
    },
    adminList: {
      query: ` SELECT * 
      FROM 
        (SELECT 
        @ROWNUM := @ROWNUM + 1 AS ROWNUM
        ,MEMBER_SEQ, MEMBER_ID, MEMBER_NM, GROUP_SEQ, EMAIL
        ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
        FROM YS_MEMBER, (SELECT @ROWNUM :=0) TMP
        WHERE DEL_YN='N'
        ORDER BY REG_DT ASC) RN
      ORDER BY RN.ROWNUM DESC `
    },
    idDupleChk: {
      query: `SELECT  
      COUNT(1) AS idCnt
      FROM YS_MEMBER
      WHERE MEMBER_ID = ? 
      AND   DEL_YN = 'N' `
    },
    adminInsert: {
      query: `INSERT YS_MEMBER SET ? , REG_DT = current_timestamp()`
    },    
    adminDelete: {
      query: `UPDATE YS_MEMBER 
              SET 
              DEL_YN = 'Y'
              ,DEL_DT = current_timestamp()
              ,DEL_ID = ?
              WHERE MEMBER_ID = ? `            
    },
    adminInfo: {
      query: `SELECT  
      MEMBER_SEQ, MEMBER_ID, MEMBER_NM, GROUP_SEQ, EMAIL
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      FROM YS_MEMBER
      WHERE DEL_YN='N'
      AND MEMBER_ID = ? `
    },
    adminUpdate : {
      query: `UPDATE YS_MEMBER SET ?
              , MOD_DT = current_timestamp()
              , MOD_ID = ?
              WHERE MEMBER_ID = ? `            
    },
    noticeList: {
      query: `SELECT  
      BOARD_SEQ, SUBJECT, CONTENTS, 
      (SELECT MEMBER_NM FROM YS_MEMBER WHERE MEMBER_ID = A.MOD_ID) AS REG_NM
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      ,DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT      
      FROM YS_BOARD A
      WHERE DEL_YN='N'
      AND GUBUN=1
      ORDER BY BOARD_SEQ DESC `
    },
    noticeInsert: {
      query: `INSERT YS_BOARD SET ? , REG_DT = current_timestamp()`
    },  
    noticeDelete: {
      query: `UPDATE YS_BOARD
              SET 
              DEL_YN = 'Y'
              ,DEL_DT = current_timestamp()
              ,DEL_ID = ?
              WHERE BOARD_SEQ = ? ` 
    },
    noticeInfo: {
      query: `SELECT  
      BOARD_SEQ, SUBJECT, CONTENTS
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      ,DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT       
      FROM YS_BOARD
      WHERE DEL_YN='N'
      AND BOARD_SEQ = ? `
    },
    noticeUpdate : {
      query: `UPDATE YS_BOARD SET 
              SUBJECT = ?
              , CONTENTS = ?
              , MOD_DT = current_timestamp()
              , MOD_ID = ?
              WHERE BOARD_SEQ = ? `            
    },
    galleryList: {
      query: `SELECT  
      BOARD_SEQ, SUBJECT, CONTENTS, 
      (SELECT MEMBER_NM FROM YS_MEMBER WHERE MEMBER_ID = A.MOD_ID) AS REG_NM
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      ,DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT      
      FROM YS_BOARD A
      WHERE DEL_YN='N'
      AND GUBUN=2
      ORDER BY BOARD_SEQ DESC `
    },
    galleryInsert: {
      query: `INSERT YS_BOARD SET ? , REG_DT = current_timestamp()`
    },  
    galleryDelete: {
      query: `UPDATE YS_BOARD
              SET 
              DEL_YN = 'Y'
              ,DEL_DT = current_timestamp()
              ,DEL_ID = ?
              WHERE BOARD_SEQ = ? ` 
    },
    galleryInfo: {
      query: `SELECT  
      BOARD_SEQ, SUBJECT, CONTENTS
      ,DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i:%s') AS REG_DT      
      ,DATE_FORMAT(MOD_DT, '%Y-%m-%d %H:%i:%s') AS MOD_DT  
      ,FILE_NM     
      FROM YS_BOARD
      WHERE DEL_YN='N'
      AND BOARD_SEQ = ? `
    },
    galleryUpdate : {
      query: `UPDATE YS_BOARD SET 
              SUBJECT = ?
              , CONTENTS = ?
              , MOD_DT = current_timestamp()
              , MOD_ID = ?
              , FILE_NM = ?
              WHERE BOARD_SEQ = ? `            
    },
    preImageInfo : {
      query: `SELECT  
                SEQ
                ,FILE_NM      
              FROM YS_FILE
              WHERE BOARD_SEQ = ?  `    
    },
    preFileRegist : {
      query: `INSERT INTO YS_FILE SET ? ON DUPLICATE KEY UPDATE ?`
    },
    preImageDelete: {
      query: `UPDATE YS_BOARD SET 
              FILE_NM = ''
              WHERE BOARD_SEQ = ? ` 
    },
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
    },

    productList: {
      query: `select t1.*, t2.path, t3.category1, t3.category2, t3.category3 
      from t_product t1, t_image t2, t_category t3
      where t1.id = t2.product_id and t2.type = 1 and t1.category_id = t3.id`
    },
    productList2: {
      query: `select t3.*, t4.path from (select t1.*, t2.category1, t2.category2, t2.category3 
        from t_product t1, t_category t2
        where t1.category_id = t2.id) t3
        left join (select * from t_image where type=1) t4
        on t3.id = t4.product_id`
    },
    productDetail: {
      query: `select t1.*, t2.path, t3.category1, t3.category2, t3.category3 
      from t_product t1, t_image t2, t_category t3
      where t1.id = ? and t1.id = t2.product_id and t2.type = 3 and t1.category_id = t3.id`
    },
    productMainImages: {
      query: `select * from t_image where product_id = ? and type = 2`
    },
    productInsert: {
      query: `insert into t_product set ?`
    },
    productImageInsert: {
      query: `insert into t_image set ?`
    },
    imageList: {
      query: `select * from t_image where product_id=?`
    },

    productDelete: {
      query: `delete from t_product where id=?`
    },
    categoryList: {
      query: `select * from t_category`
    },
    sellerList: {
      query: `select * from t_seller`
    },
    signUp: {
      query: `insert into t_user set ? on duplicate key update ?`
    }
  }