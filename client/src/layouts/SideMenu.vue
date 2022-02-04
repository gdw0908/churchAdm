<template>
  <aside class="side_menu">
    <h1 class="logo_wrap">
      <a class="navbar-brand" href="#"><img src="../assets/images/header_logo.png" alt="양과목장"></a>
    </h1>
    <div class="nav_menu_wrap">
      <ul class="navbar_nav">
        <li class="nav_item">
          <router-link :class="['nav-link', $route.path.indexOf('main') > -1 ? 'active' : '']" to="/main">
            <img src="../assets/images/menu_icon1.svg" alt="HOME">
            HOME
          </router-link>
        </li>
        <li class="nav_item">
          <router-link :class="['nav-link', $route.path.indexOf('') > -1 ? 'active' : '']" to="/">
            <img src="../assets/images/menu_icon2.svg" alt="회원관리">
            회원 관리
          </router-link>
        </li>
        <li class="nav_item">
          <router-link :class="['nav-link', $route.path.indexOf('admin') > -1 ? 'active' : '']" to="/adminList">
            <img src="../assets/images/menu_icon3.svg" alt="교회 관리">
            교회 관리
          </router-link>
        </li>
        <li class="nav_item">
          <router-link :class="['nav-link', $route.path.indexOf('') > -1 ? 'active' : '']" to="/freeboardList">
            <img src="../assets/images/menu_icon3.svg" alt="자유게시판">
            자유게시판
          </router-link>
        </li>
        <li class="nav_item">
          <router-link :class="['nav-link', $route.path.indexOf('notice') > -1 ? 'active' : '']" to="/noticeList">
            <img src="../assets/images/menu_icon5.svg" alt="공지사항">
            공지사항
          </router-link>
        </li>
        <li class="nav_item">
          <router-link :class="['nav-link', $route.path.indexOf('qna') > -1 ? 'active' : '']" to="/qnaList">
            <img src="../assets/images/menu_icon6.svg" alt="공지사항">
            문의 내역
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
<script>
export default {
  name: 'sideMenu',
  components: {},
  data() {
    return {

    };
  }, 
  setup() {}, 
  created() {},
  mounted() {},
  unmounted() {},
  methods: {}
}
</script>