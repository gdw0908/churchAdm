<template>
  <main class="mt-3">
    <div class="container sticky-top">
      <h2 class="text-center">관리자 로그인</h2>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">아이디</label>
        <div class="col-md-5">
          <input type="text" class="form-control" v-model="admin.admin_id">
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">패스워드</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="password" class="form-control" v-model="inputPass">
          </div>
        </div>
      </div>
      <div class="d-grid gap-2 col-6 mx-auto">
        <button type="button" class="btn btn-lg btn-danger" @click="adminLogin">로그인</button>
      </div>
    </div>
  </main>
</template>
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
