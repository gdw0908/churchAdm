<template>
  <header>
    <!-- toggle btn -->
      <div class="toggle_wrap" @click="closeMenu">
        <button type="button" class="toggle_btn" >
          <img class="arrow_icon" src="../assets/images/toggle_icon.svg" alt=">">
        </button>
      </div>
    <nav class="navbar navbar-expand-lg">
      <!-- <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button> -->

      <!-- <b>로그인한 회원 이름</b> -->
      <div class="user_name">
        <p class="user_name_info"><b>Super Manager</b> 님 어서오세요.</p>
        <span class="welcome">Welcome to the admin page.</span>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <button class="btn" type="button" v-if="user.MEMBER_ID == undefined" @click="login">로그인</button>
        <button class="btn" type="button" v-else @click="logout" >로그아웃</button>
        <!--<form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form> -->
      </div>
      <p class="copyright">
        COPYRIGHT &copy; 2022 양과목장 All RIGHTS RESERVED.
      </p>
    </nav>
  </header>
</template>
<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */


</style>
<script>
export default {
  name: 'header',
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    kakaoLoin() {
      window.Kakao.Auth.login({
        scope: 'profile, account_email, gender',
        success: this.getProfile
      });
    },
    getProfile(authObj) {
      console.log(authObj);
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: res => {
          const kakao_account = res.kakao_account;
          console.log(kakao_account);
          this.login(kakao_account);
          alert("로그인 성공!");
        }
      });
    },
    login() {
      this.$router.push({path:'/adminLogin'}); 
    },
    logout(){
      this.$store.commit("user", {});
      //alert("로그아웃");
      this.$router.push({path:'/adminLogin'}); 
    },

    closeMenu(e) {
      const sideMenu = document.querySelector('.side_menu');
      const MainContainer = document.querySelector('.main_container');
      const header = document.querySelector('header');
      const logo = document.querySelector('.logo');
      const arrorIcon = document.querySelector('.arrow_icon');

      sideMenu.classList.toggle('close')
      arrorIcon.classList.toggle('rotate')
      MainContainer.classList.toggle('close')
      header.classList.toggle('close')
      logo.classList.toggle('show')
    }

  }
}
</script>