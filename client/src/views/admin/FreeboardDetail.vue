<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">자유게시판</h2>
        <div class="container inner">
          <article class="user_qna_wrap free_wrap">
            <h3 class="tit">{{freeboard.TITLE}}</h3>
            <div class="con">{{freeboard.CONTS}}</div>
            <div class="bt_info">
              <ul>
                <li class="user_name">작성자: {{freeboard.REG_NM}}</li>
                <li>조회 {{freeboard.VIEW_CNT}}</li>
                <li>{{freeboard.REG_DT}}</li>
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
            <section class="reply_wrap" :key="i" v-for="(comment, i) in commentList">
                <!-- 댓글 아이템 -->
                <ul class="reply_list">
                    <li class="reply_item">
                      <ul>
                          <li class="user_name">{{comment.REG_NM}}<span>{{comment.REG_DT}}</span></li>
                          <li class="content">{{comment.RE_CONTS}}</li>
                      </ul>
                      <button type="button" class="delete_btn"><img src="../../assets/images/del_icon.svg" @click="commentDelete(comment.ARTICLE_REPLY_SEQ)" alt="삭제"></button>
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
    </div>
  </div>
</template>

<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu'

export default {
  components: {
    Header, 
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
      },
      comment:{
        RE_CONTS: '',
        REG_NM: '',
        REG_DT: ''
      },
      commentList:[]
    };
  },
  created(){
      this.getDetail();
      this.getComment();
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
      let comment = await this.$api("/apirole/freeboardComment", {param:[
        this.$route.query.article_seq
      ]});
      console.log("comment[0] ==> " + comment[0]);
      console.log("comment[0] JSON --> " + JSON.stringify(comment[0]));
      if(comment.length > 0){
        this.commentList = comment;    //댓글 for문에 값 할당
        console.log("comment[0] ==> " + JSON.stringify(this.commentList));
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
    },
    commentDelete(article_reply_seq) {
      this.$swal.fire({
        title: '댓글을 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: `삭제`,
        cancelButtonText: `취소`
      }).then(async (result) => {
        if(result.isConfirmed){
          console.log("article_reply_seq ==> " + article_reply_seq);
          await this.$api("/apirole/commentDelete", {param:[article_reply_seq]});
          this.$swal.fire('삭제되었습니다!', '', 'success')
          
        }
        this.$router.go();
      });
    }
  }
}
</script> 