const dbcall = require('../utils/dbconfig')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const utils = require('../utils/utils')
const church_staff = require('../sqlmap/church_staff.js')

//Controller 로직 구현
let adminManage = async function (request, res) {
  let url = request.url.split('/')
  console.log('url==' + url[2])
  // console.log('request.session.adminId==' + request.session.adminId)
  if (!request.session.adminId) {
    return res.status(401).send({
      error: 'You need to login.',
    })
  }
  try {
    //등록, 수정일때 패스워드 항목 암호화 처리

    if (
      url[2].indexOf('adminInsert') > -1 ||
      url[2].indexOf('adminUpdate') > -1
    ) {
      // console.log('dkssud' + request.body)
      // console.log('암호화전 패스워드=' + request.body.param[0].member_pw)
      //패스워드 암호화 처리
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(request.body.param[0].member_pw, salt)
      request.body.param[0].member_pw = hash
      //console.log("암호화후 패스워드=="+request.body.param[0].member_pw);
    }
    //리스트요청에서 검색어 검색일때 처리
    if (url[2].indexOf('adminList') > -1) {
      //console.log('request.body.param===' + request.body.param)
      let where = ''
      let whereList = []
      let values = []
      if (!utils.isEmpty(request.body.param)) {
        whereList.push(' AND MEMBER_ID LIKE ? ')
        whereList.push(' OR MEMBER_NM LIKE ? ')
        values.push('%' + request.body.param + '%')
        values.push('%' + request.body.param + '%')
      } else {
        whereList.push(' AND 1=1 ')
        values = []
      }
      // console.log('whereList===' + whereList.length)
      for (let i = 0; i < whereList.length; i++) {
        //console.log('whereList[0]===' + whereList[i])
        where += whereList[i]
      }
      where += ' ORDER BY REG_DT ASC ) RN  ORDER BY RN.ROWNUM DESC '
      //파라미터 값 제할당
      request.body.param = []
      request.body.param = values
      request.body.where = []
      request.body.where[0] = where
    }
    if (url[2].indexOf('adminInsert') > -1) {
      let code_nm = request.body.param[0].church_nm

      let code_insert2 = await dbcall.db(church_staff, 'code_insert', code_nm)

      if (code_insert2) {
        let code_select = await dbcall.db(
          church_staff,
          'code_select',
          request.body.param,
        )
        request.body.param[0].CODE = code_select[0].CODE
        console.log(JSON.stringify(request.body.param))
      }
    }
    res.send(
      await dbcall.db(
        church_staff,
        url[2],
        request.body.param,
        request.body.where,
      ),
    )
  } catch (err) {
    console.log('111111111111')
    console.log(err)
    res.status(500).send({
      error: err,
    })
  }
}

module.exports = {
  adminManage: adminManage,
}
