<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">회원 관리</h2>
        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">회원정보 수정</h3>
          </section>
          <article class="join_input_box">
            <label>아이디</label>
            <div class="input_wrap">
              <!-- 아이디는 고정값 -->
              <input
                type="text"
                class="form-control"
                ref="member_id"
                v-model="member.MEMBER_ID"
                disabled
              />
            </div>
          </article>
          <article class="join_input_box">
            <label>이름</label>
            <div class="input_wrap">
              <input
                type="text"
                class="form-control"
                ref="member_nm"
                v-model="member.MEMBER_NM"
                placeholder="성함을 입력해주세요."
                disabled
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
                v-model="member.EMAIL"
                placeholder="이메일 주소를 입력해주세요."
              />
            </div>
          </article>
          <article class="join_input_box">
            <label>휴대전화</label>
            <div class="input_wrap">
              <input
                type="text"
                class="form-control"
                ref="fonNumber"
                v-model="member.CELL"
                placeholder="핸드폰 번호를 - 없이 입력해주세요."
              />
            </div>
          </article>
          <article class="join_input_box">
            <label>성별</label>
            <div class="input_wrap">
              <input
                type="text"
                class="form-control"
                ref="member_id"
                v-model="member.GENDER"
                placeholder="성별을 입력해주세요."
                disabled
              />
            </div>
          </article>
          <article class="join_input_box">
            <label>생년월일</label>
            <div class="input_wrap">
              <input
                type="text"
                class="form-control"
                ref="member_id"
                v-model="member.BIRTHDAY"
                placeholder="생년월일 입력해주세요."
                disabled
              />
            </div>
          </article>
          <article class="join_input_box">
            <label>교회코드</label>
            <div class="input_wrap">
              <!-- 교회코드 고정값 -->
              <input
                type="text"
                class="form-control"
                ref="MEMBER_CODE"
                v-model="member.MEMBER_CODE"
                disabled
              />
            </div>
          </article>
          <article class="join_input_box">
            <label>교회이름</label>
            <div class="input_wrap">
              <!-- 교회코드 고정값 -->
              <input
                type="text"
                class="form-control"
                ref="CHURCH_NM"
                v-model="member.CHURCH_NM"
                disabled
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
                v-model="this.member_pw2"
                @keyup="this.member_pwchk = ''"
                placeholder="비밀번호를 입력해주세요."
              />
            </div>
          </article>
          <article class="join_input_box bottom">
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
      <Footer />
    </div>
  </div>
</template>
<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu'
import Footer from '../../layouts/Footer'

export default {
  components: {
    Header,
    SideMenu,
    Footer
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      member: {
        MEMBER_ID: '',
        MEMBER_NM: '',
        MEMBER_PW: '',
        group_seq: '1',
        EMAIL: '',
        MEMBER_CODE: '',
        GENDER: '',
        CELL: '',
        BIRTHDAY: '',
        CHURCH_NM: ''
      },
      userList: [],
      pageList: [],
      member_pwchk: '',
      isPwState1: false,
      isPwState2: false,
      idDupleChk: false,
      isPwChk: false,
      email: '',
      member_pw2: ''
    }
  },
  created () {
    this.getMemberInfo()
  },
  mounted () {
    if (this.user.MEMBER_ID == undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    } else {
      this.member.reg_id = this.user.MEMBER_ID
    }
  },
  methods: {
    goToList () {
      this.$router.push({ path: '/userList' })
    },
    async getMemberInfo () {
      const memberInfo = await this.$api('/apirole/memberInfo', {
        param: [this.$route.query.member_id]
      })
      if (memberInfo.length > 0) {
        this.member = memberInfo[0]
      }
    },
    inputChkPwd () {
      if (this.member_pw2 == this.member_pwchk) {
        this.isPwState1 = true
        this.isPwState2 = false
        this.isPwChk = true
      } else {
        this.isPwState1 = false
        this.isPwState2 = true
        this.isPwChk = false
      }
    },
    adminInsert () {
      if (!this.member.MEMBER_NM) {
        return this.$swal(
          '이름은 필수 입력값입니다.',
          this.$refs.member_nm.focus()
        )
      }

      if (!this.member.EMAIL) {
        return this.$swal(
          '이메일은 필수 입력값입니다.',
          this.$refs.email.focus()
        )
      } else if (!this.validEmail(this.member.EMAIL)) {
        return this.$swal(
          '올바른 이메일 형식이 아닙니다.',
          this.$refs.email.focus()
        )
      }
      if (!this.member.CELL) {
        return this.$swal(
          '휴대전화는 필수 입력값입니다.',
          this.$refs.cell.focus()
        )
      }
      if (!this.member.BIRTHDAY) {
        return this.$swal(
          '생년월일은 필수 입력값입니다.',
          this.$refs.BIRTHDAY.focus()
        )
      }
      if (!this.isPwChk) {
        return this.$swal(
          '패스워드가 불일치 합니다.',
          this.$refs.member_pwchk.focus()
        )
      }
      if (!this.member_pwchk) {
        return this.$swal(
          '비밀번호는 필수 입력값입니다.',
          this.$refs.member_pwInp.focus()
        )
      }
      if (!this.member_pwchk) {
        return this.$swal(
          '비밀번호 확인은 필수 입력값입니다.',
          this.$refs.member_pwchk.focus()
        )
      }

      this.$swal
        .fire({
          title: '정말 등록 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        })
        .then(async (result) => {
          this.member.MEMBER_PW = this.member_pwchk
          console.log(this.member)
          if (result.isConfirmed) {
            try {
              await this.$api('/apirole/memberUpdate', {
                param: [this.member, this.member.MEMBER_ID]
              })
              this.$swal.fire('저장되었습니다!', '', 'success')
              this.$router.push({ path: '/userList' })
            } catch (e) {
              console.log('error==' + e)
              return this.$swal('처리 중 오류가 발생했습니다.')
            }
          }
        })
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>
