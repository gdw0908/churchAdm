const dbcall = require('../utils/dbconfig');
const fs = require('fs');
const utils = require('../utils/utils');
let notice = require('../sqlmap/notice.js');

//Controller
let noticeManage = async function(request, res){
    let url = request.url.split('/');
    console.log("noticeList url => " + url[2]);
    console.log("request.session.adminId => " + request.session.adminId);

    if(!request.session.adminId){
        return res.status(401).send({
            error: '로그인이 필요합니다'
        });
    }
    try {
        if( url[2].indexOf("noticeInsert") > -1 ||
            url[2].indexOf("noticeUpdate") > -1){
            request.session.files = new Array; //에디터로 올린 이미지 정보 세션에서 삭제
        } else{
            if(request.session.files.length > 0){
                console.log("저장안한 파일 삭제 요청");
                utils.fileDeleteImage(request, request.session.files);
            }
        }
        //검색어 조회할때 처리
        if(url[2].indexOf("noticeList") > -1){
            //2번째 url에서 noticeList가 있으면 0을 리턴(기본값은 0) > -1
            console.log("url[2].indexOf ==> " + url[2].indexOf("noticeList"));
            console.log("request.body.param==="+request.body.param);
            let where = "";
            let whereList = [];
            let values = [];

            if(!utils.isEmpty(request.body.param)){
                whereList.push("AND (TITLE LIKE ?");
                whereList.push("OR CONTS LIKE ?)");
                values.push("%" + request.body.param + "%");    //검색조건에 해당되었을때 해당데이터들 호출
                values.push("%" + request.body.param + "%");
            } else{
                whereList.push("AND 1=1");                      //검색조건에 없을때 1=1
                values = [];
            }
            for(let i = 0; i < whereList.length; i++){
                console.log("whereList[i] ==> " + whereList[i]);
                where += whereList[i]
            }
            where += `) RN ORDER BY RN.ROWNUM DESC `

            //파라미터 값 제할당
            request.body.param = [];
            request.body.param = values;
            request.body.where = [];
            request.body.where[0] = where;
        }
        //db호출
        res.send(await dbcall.db(notice, url[2], request.body.param, request.body.where));
    } catch(err){
        res.status(500).send({
            error: err
        });
    }
};

module.exports = {
    noticeManage: noticeManage
};