<template>
  <header>
    <!-- toggle btn -->
    <div class="toggle_wrap" @click="closeMenu">
      <button type="button" class="toggle_btn" >
        <img class="arrow_icon" src="../assets/images/toggle_icon.svg" alt=">">
      </button>
    </div>
    <nav class="navbar navbar-expand-lg">
      <div class="user_name">
        <p class="user_name_info" v-if="user.CODE == 1"><b>Super Manager</b> 님 어서오세요.</p>
        <p class="user_name_info" v-else><b>{{user.CHURCH_NM}}</b> 님 어서오세요.</p>
        <span class="welcome">Welcome to the admin page.</span>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <button class="btn" type="button" v-if="user.MEMBER_ID == undefined" @click="login">로그인</button>
        <button class="btn" type="button" v-else @click="logout" >로그아웃</button>
      </div>
      <p class="copyright">
        COPYRIGHT &copy; 2022 양과목장 All RIGHTS RESERVED.
      </p>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'header',
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    kakaoLoin () {
      window.Kakao.Auth.login({
        scope: 'profile, account_email, gender',
        success: this.getProfile
      })
    },
    getProfile (authObj) {
      console.log(authObj)
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: res => {
          // eslint-disable-next-line camelcase
          const kakao_account = res.kakao_account
          console.log(kakao_account)
          this.login(kakao_account)
          alert('로그인 성공!')
        }
      })
    },
    login () {
      this.$router.push({ path: '/adminLogin' })
    },
    logout () {
      this.$store.commit('user', {})
      // alert("로그아웃");
      this.$router.push({ path: '/adminLogin' })
    },

    closeMenu (e) {
      const sideMenu = document.querySelector('.side_menu')
      const MainContainer = document.querySelector('.main_container')
      const header = document.querySelector('header')
      const logo = document.querySelector('.logo')
      const arrorIcon = document.querySelector('.arrow_icon')

      sideMenu.classList.toggle('close')
      arrorIcon.classList.toggle('rotate')
      MainContainer.classList.toggle('close')
      header.classList.toggle('close')
      logo.classList.toggle('show')
    }

  }
}
</script>
