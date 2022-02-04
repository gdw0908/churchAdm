<template>
    <div>
        <SideMenu />
        <div class="main_container">
            <Header />
            <main class="main_wrap">
                <h2 class="table_tit">자유게시판 상세페이지</h2>
            </main>
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
      Footer, 
      SideMenu
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    }
}
</script>