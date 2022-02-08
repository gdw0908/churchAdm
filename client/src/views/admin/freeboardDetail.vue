<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">자유게시판 상세페이지</h2>
        <div class="table_container">
          <table class="table table-hover table-bordered">
            <tr>
              <th>제목</th>
              <td>{{freeboard.TITLE}}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{{freeboard.CONTS}}</td>
            </tr>
          </table>
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
    Footer, 
    SideMenu
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      freeboard:{
        TITLE: '', 
        CONTS: ''
      },
      keyword: ''
    };
  },
  mounted() {
    console.log("1111=="+this.user.MEMBER_ID);        
    // if(this.user.MEMBER_ID == undefined) {
    //     this.$swal("로그인을 해야 이용할 수 있습니다.");
    //     this.$router.push({path:'/adminLogin'}); 
    // }
    //this.getDetail();
  },
  methods: {
    goList() {
      this.$router.push({path:'/freeboardList'}); 
    },
    async getDetail(){
      let freeboardInfo = await this.$api("/apirole/freeboardDetail", {param:[this.keyword]});
      console.log("freeboardInfo[0] ==>" + freeboardInfo[0]);
      if(freeboardInfo.length > 0){
        this.freeboard = freeboardInfo[0];
        console.log("freeboardInfo ==> " + JSON.stringify(freeboardInfo));
      }
    },
    goDelete(article_seq) {
      this.$swal.fire({
        title: '정말 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: `삭제`,
        cancelButtonText: `취소`
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(article_seq)
          await this.$api("/apirole/freeboardDelete",{param:[this.user.MEMBER_ID, article_seq]});
          this.goList();
          this.$swal.fire('삭제되었습니다!', '', 'success')
        } 
      });
    }
  }
}
</script> 