<template>
  <div>
    <main class="login_container">
      <article class="login_logo_wrap">
        <img src="../../assets/images/login_logo.svg" alt="양과목장">
        <h2>Get Started</h2>
        <p><b>모바일 교회앱 양과목장</b>의 관리자 페이지입니다.</p>
      </article>
      <article class="login_wrap">
        <h3>로그인</h3>
        <p>관리자 로그인을 해주세요.</p>
        <div class="input_wrap">
          <label class="col-md-3 col-form-label">아이디</label>
          <input type="text" placeholder="ID" class="form-control" v-model="admin.admin_id">
        </div>
        <div class="input_wrap">
          <label class="col-md-3 col-form-label">비밀번호</label>
          <input type="password" placeholder="password" class="form-control" v-model="inputPass" @keydown.enter="adminLogin">
        </div>
  
        <button type="button" class="login_btn" @click="adminLogin">로그인</button>

        <div class="bt_wrap">
          <div>
            <input type="checkbox" name="save_id" id="save_id" class="save_chek">
            <label for="save_id">아이디 저장</label>
          </div>
          <a href="#">비밀번호 재설정</a>
        </div>
      </article>

    </main>
  </div>
</template>

<style scoped>
  @import '../../css/style.css';
</style>

<script>
export default {
  name: 'adminLogin',
  data () {
    return {
      admin: {
        admin_id: '',
        admin_pw: ''
      },
      adminInfo: {},
      inputPass: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    async adminLogin () {
      if (this.admin.admin_id === '') {
        return this.$swal('아이디는 필수 입력값입니다.')
      }
      if (this.inputPass === '') {
        return this.$swal('패스워드는 필수 입력값입니다.')
      }
      // this.admin.admin_pw = hashPass;
      // console.log("this.admin.admin_pw=="+this.admin.admin_pw);
      const adminInfoRes = await this.$api('/api/adminLogin', { param: [this.admin.admin_id, this.inputPass] })
      console.log('adminInfoRes[0]===' + adminInfoRes[0])
      if (adminInfoRes[0]) {
        this.adminInfo = adminInfoRes[0]
        console.log('로그인 후 정보 : ' + this.adminInfo)
        console.log('로그인 후 정보2 : ' + this.adminInfo.GROUP_SEQ)
        this.$store.commit('user', this.adminInfo)
        this.$router.push({ path: '/adminList' })
      } else {
        this.$swal('로그인에 실패하였습니다.')
      }
    }
  }
}
</script>
