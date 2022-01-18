<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">관리자 메뉴</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link :class="['nav-link', $route.path.indexOf('admin') > -1 ? 'active' : '']" to="/adminList">관리자 관리</router-link>
          </li>
          <li class="nav-item">
            <router-link :class="['nav-link', $route.path.indexOf('notice') > -1 ? 'active' : '']" to="/noticeList">공지사항</router-link>
          </li>
          <li class="nav-item">
            <router-link :class="['nav-link', $route.path.indexOf('qna') > -1 ? 'active' : '']" to="/qnaList">질문과답변</router-link>
          </li>
          <li v-if="user.MEMBER_ID==undefined"><button class="btn btn-danger" type="button" @click="login">로그인</button></li>
          <li v-else><button class="btn btn-danger" type="button" @click="logout">로그아웃</button></li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
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
    }

  }
}
</script>