const dbcall = require('../utils/dbconfig');
const fs = require('fs');
const utils = require('../utils/utils');
let notice = require('../sqlmap/notice.js');

//Controller
let noticeManage = async function(request, res){
    let url = request.url.split('/');
    console.log("url => " + url[2]);
    console.log("request.session.adminId => " + request.session.adminId);

    if(!request.session.adminId){
        return res.status(401).send({
            error: '로그인이 필요합니다'
        });
    }
    try {
        if( url[2].indexOf("qnaInsert") > -1 ||
            url[2].indexOf("qnaUpdate") > -1){
            request.session.files = new Array; //에디터로 올린 이미지 정보 세션에서 삭제
        } else{
            if(request.session.files.length > 0){
                console.log("저장안한 파일 삭제 요청");
                utils.fileDeleteImage(request, request.session.files);
            }
        }
        res.send(await noticeDBCall.db(url[2], request.body.param, request.body.where));
    } catch(err){
        res.status(500).send({
            error: err
        });
    }
};

const noticeDBCall = {
    async db(alias, param = [], where = ''){
        return new Promise((resolve, reject) => dbcall.query(notice[alias].query + where, param, (error, rows) => {
            if(error){
                console.log("db error ==> " + error);
                resolve({
                    error
                });
                throw error;
            } else{
                resolve(rows);
            }
        }));
    }
}

module.exports = {
    noticeManage: noticeManage
};