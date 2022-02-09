<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">자유게시판</h2>
        <div class="container inner">
          <article class="user_qna_wrap free_wrap">
            <h3 class="tit">제목이 나타납니다.</h3>
            <div class="con">
              문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다
.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.
문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다
.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.문의 내용이 나타납니다.
            </div>
            <div class="bt_info">
              <ul>
                <li class="user_name">작성자: 김**</li>
                <li>조회 100</li>
                <li>2022.02.07</li>
              </ul>
              <button type="button" class="delete_btn">
                <img src="../../assets/images/del_icon.svg" @click="goDelete(freeboard.ARTICLE_SEQ)" alt="삭제">
              </button>
            </div>
          </article>
        </div>

        <div class="reply_container">
          <p class="reply_count"><b>3</b>개의 댓글</p>

          <!-- 댓글 리스트 반복 -->
          <section class="reply_wrap">
            <!-- 댓글 아이템 -->
            <ul class="reply_list">
              <li class="reply_item">
                <ul>
                  <li class="user_name">이철수<span>2021.12.30</span></li>
                  <li class="content">댓글 보여지는곳
                  </li>
                </ul>
                <button type="button" class="delete_btn"><img src="../../assets/images/del_icon.svg" alt="삭제"></button>
              </li>
            </ul>

            <!-- 대댓글 리스트 -->
            <article class="nested_reply">
              <ul class="nested_reply_list">
                <li class="reply_item">
                  <ul>
                    <li class="user_name">홍길동<span>2021.12.30</span></li>
                    <li class="content">대댓글 보여지는곳
                    </li>
                  </ul>
                  <button type="button" class="delete_btn"><img src="../../assets/images/del_icon.svg" alt="삭제"></button>
                </li>
              </ul>
            </article>
          </section>

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
        CONTS: '',
        REG_NM: '',
        VIEW_CNT: '',
        REG_DT: ''
      }
    };
  },
  created(){
      this.getDetail();
  },
  mounted() {
    console.log("1111=="+this.user.MEMBER_ID);        
    // if(this.user.MEMBER_ID == undefined) {
    //     this.$swal("로그인을 해야 이용할 수 있습니다.");
    //     this.$router.push({path:'/adminLogin'}); 
    // }
  },
  methods: {
    goList() {
      this.$router.push({path:'/freeboardList'}); 
    },
    async getDetail(){
      let freeboardInfo = await this.$api("/apirole/freeboardDetail", {param:[
          this.$route.query.article_seq
      ]});
      console.log("freeboardInfo[0] ==>" + freeboardInfo[0]);
      if(freeboardInfo.length > 0){
          this.freeboard = freeboardInfo[0];
          console.log("freeboardInfo ==> " + JSON.stringify(freeboardInfo));
      }
    },
    async getComment(){
        try{
            this.freeComment = await this.$api("/apirole/freeboardComment", {param:[this.$route.query.article_seq]});
        }catch(e){
            console.log("error ==> " + e);
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