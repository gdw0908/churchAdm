<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">교회 관리</h2>
        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">교회 관리자 수정</h3>
          </section>
          <article class="join_input_box">
            <label>아이디</label>
            <div class="input_wrap">
              <input
                type="text"
                class="form-control"
                ref="member_id"
                v-model="admin.MEMBER_ID"
                @keyup="beforeMemChk"
                placeholder="아이디를 입력해주세요."
                disabled
              />
            </div>
          </article>
          <!-- <article class="join_input_box">
            <label>지역</label>
            <div class="input_wrap">
              <select name="wrt_area" id="address" class="select_area" v-model="areaSelect">
                <option disabled value="">선택</option>
                <option>서울특별시</option>
                <option>부산광역시</option>
                <option>대구광역시</option>
                <option>인천광역시</option>
                <option>광주광역시</option>
                <option >대전광역시</option>
                <option>울산광역시</option>
                <option>경기도</option>
                <option>강원도</option>
                <option>충청북도</option>
                <option>충청남도</option>
                <option>전라북도</option>
                <option>전라남도</option>
                <option>경상북도</option>
                <option>경상남도</option>
                <option>제주도</option>
                <option>세종특별자치시</option>
              </select>
            </div>
          </article>

          <article class="join_input_box">
            <label>교회명</label>
            <div class="input_wrap">
              <input type="text" class="form-control" ref="" placeholder="교회명을 입력해주세요.">
            </div>
          </article> -->

          <article class="join_input_box">
            <label>관리자 이름</label>
            <div class="input_wrap">
              <input
                type="text"
                class="form-control"
                ref="member_nm"
                v-model="admin.MEMBER_NM"
                placeholder="성함을 입력해주세요."
              />
            </div>
          </article>

          <article class="join_input_box">
            <label>관리자 연락처</label>
            <div class="input_wrap">
              <input
                type="email"
                class="form-control"
                ref="member_cell"
                v-model="admin.MEMBER_CELL"
                @keyup="this.member_cell = ''"
                placeholder="관리자 연락처를 입력해주세요."
              />
            </div>
          </article>

          <article class="join_input_box">
            <label>교회 연락처</label>
            <div class="input_wrap">
              <input
                type="email"
                class="form-control"
                ref="church_cell"
                v-model="admin.CHURCH_CELL"
                @keyup="this.church_cell = ''"
                placeholder="교회 연락처를 입력해주세요."
              />
            </div>
          </article>

          <article class="join_input_box">
            <label>이메일</label>
            <div class="input_wrap">
              <input
                type="email"
                class="form-control"
                ref="email"
                v-model="admin.EMAIL"
                @keyup="this.emaill = ''"
                placeholder="이메일 주소를 입력해주세요."
              />
            </div>
          </article>

          <article class="join_input_box">
            <label>비밀번호</label>
            <div class="input_wrap">
              <input
                type="password"
                class="form-control"
                ref="member_pwInp"
                v-model="admin.member_pw"
                @keyup="this.member_pwchk = ''"
                placeholder="비밀번호를 입력해주세요."
              />
            </div>
          </article>

          <article class="join_input_box" bottom>
            <label>비밀번호 확인</label>
            <div class="input_wrap">
              <input
                type="password"
                class="form-control"
                ref="member_pwchk"
                v-model="member_pwchk"
                @keyup="inputChkPwd()"
                placeholder="비밀번호를 다시 입력해주세요."
              />
              <span
                class="pw_msg pw_same"
                ref="pwdChkSpan1"
                v-show="isPwState1"
              >
                비밀번호가 일치 합니다.
              </span>
              <span
                class="pw_msg pw_discord"
                ref="pwdChkSpan2"
                v-show="isPwState2"
              >
                비밀번호가 일치하지 않습니다.
              </span>
            </div>
          </article>

          <article class="btn_wrap">
            <button type="button" class="ro_btn gray" @click="goToList">
              취소
            </button>
            <button type="button" class="ro_btn" @click="adminInsert">
              등록
            </button>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu'
const bcrypt = require('bcryptjs')

export default {
  components: {
    Header,
    SideMenu,
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  data() {
    return {
      admin: {
        MEMBER_ID: '',
        MEMBER_NM: '',
        MEMBER_PW: '',
        GROUP_SEQ: '1',
        EMAIL: '',
        MOD_ID: '',
        MEMBER_CELL: '',
        CHURCH_CELL: '',
      },
      areaSelect: '',
      member_pwchk: '',
      isPwState1: false,
      isPwState2: false,
      idDupleChk: false,
      isPwChk: false,
      beforeMemId: '',
      isBeforeId: true,
      member_cell: '',
      church_cell: '',
      email: '',
      member_nm: '',
    }
  },
  created() {
    this.getAdminInfo()
  },
  mounted() {
    if (this.user.MEMBER_ID == undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    } else {
      this.admin.mod_id = this.user.MEMBER_ID
    }
  },
  methods: {
    goToList() {
      this.$router.push({ path: '/adminList' })
    },
    async getAdminInfo() {
      let adminInfo = await this.$api('/apirole/adminInfo', {
        param: [this.$route.query.member_id],
      })
      console.log('adminInfo[0]==' + adminInfo[0].MEMBER_ID)
      if (adminInfo.length > 0) {
        this.beforeMemId = adminInfo[0].MEMBER_ID
        this.idDupleChk = true
        this.admin = adminInfo[0]
      }
    },
    // async goDupleChk() {
    //   if (this.admin.MEMBER_ID == '') {
    //     return this.$swal('아이디는 필수 입력값입니다.')
    //   }
    //   try {
    //     let idChk = await this.$api('/apirole/idDupleChk', {
    //       param: [this.admin.MEMBER_ID],
    //     })
    //     //console.log("idChk==="+JSON.stringify(idChk));
    //     console.log('idChkCnt1===' + idChk[0].idCnt)
    //     if (idChk[0].idCnt > 0) {
    //       this.$swal(
    //         '이미 사용중인 아이디 입니다.',
    //         this.$refs.member_id.focus(),
    //       )
    //       this.admin.MEMBER_ID = ''
    //       this.idDupleChk = false
    //     } else {
    //       this.idDupleChk = true
    //       this.$swal('사용할 수 있는 아이디 입니다.')
    //     }
    //   } catch (e) {
    //     console.log('error==' + e)
    //   }
    // },
    inputChkPwd() {
      if (this.admin.member_pw == this.member_pwchk) {
        this.isPwState1 = true
        this.isPwState2 = false
        this.isPwChk = true
      } else {
        this.isPwState1 = false
        this.isPwState2 = true
        this.isPwChk = false
      }
    },
    beforeMemChk() {
      if (this.admin.MEMBER_ID == this.beforeMemId) {
        this.isBeforeId = true
        this.idDupleChk = true
      } else {
        this.isBeforeId = false
        this.idDupleChk = false
      }
    },
    adminInsert() {
      if (!this.admin.MEMBER_ID) {
        return this.$swal(
          '아이디는 필수 입력값입니다.',
          this.$refs.member_id.focus(),
        )
      }
      if (!this.$refs.member_nm.value) {
        return this.$swal(
          '이름은 필수 입력값입니다.',
          this.$refs.member_nm.focus(),
        )
      }
      if (!this.$refs.church_cell.value) {
        return this.$swal(
          '교회연락처는 필수 입력값입니다.',
          this.$refs.church_cell.focus(),
        )
      }
      if (!this.admin.member_pw) {
        return this.$swal(
          '비밀번호는 필수 입력값입니다.',
          this.$refs.member_pwInp.focus(),
        )
      }
      if (!this.member_pwchk) {
        return this.$swal(
          '비밀번호 확인은 필수 입력값입니다.',
          this.$refs.member_pwchk.focus(),
        )
      }
      if (!this.$refs.email.value) {
        return this.$swal(
          '이메일은 필수 입력값입니다.',
          this.$refs.email.focus(),
        )
      } else if (!this.validEmail(this.admin.EMAIL)) {
        return this.$swal(
          '올바른 이메일 형식이 아닙니다.',
          this.$refs.email.focus(),
        )
      }
      if (!this.isPwChk) {
        return this.$swal(
          '패스워드가 불일치 합니다.',
          this.$refs.member_pwchk.focus(),
        )
      }

      this.$swal
        .fire({
          title: '수정 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `수정`,
          cancelButtonText: `취소`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$api('/apirole/adminUpdate', {
                param: [this.admin, this.admin.MEMBER_ID, this.beforeMemId],
              })
              this.$swal.fire('저장되었습니다!', '', 'success')
              this.$router.push({ path: '/adminList' })
            } catch (e) {
              console.log('error==' + e)
            }
          }
        })
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
  },
}
</script>
