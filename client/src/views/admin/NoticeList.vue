<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">    
        <h2 class="table_tit">공지사항</h2>

        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">게시물 관리</h3>

            <article class="search_wrap">
              <div class="search_box">
                <input type="text" class="form-control" ref="keyword" v-model="keyword" placeholder="제목이나 내용을 검색해주세요." @keyup.enter="goList">
                <button class="search_btn" type="button" @click="goList">
                  <img src="../../assets/images/search_icon.svg" alt="검색">
                </button>
              </div>
              
              <button type="button" class="write_btn" @click="goRegist()">
                <img src="../../assets/images/write_icon.png" alt="글쓰기">
                글쓰기
              </button>
            </article> 
          </section>

          <div class="table_container">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Title</th>
                  <th scope="col">Writer</th>
                  <th scope="col">Disclosure</th>
                  <th scope="col">Date</th>
                  <th scope="col">Rectify</th>
                  <th scope="col" class="text-center">Edit</th>
                  <th scope="col" class="text-center" style="padding: 0;">Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr :key="i" v-for="(notice,i) in noticeList">
                  <td scope="row">{{notice.ROWNUM}}</td>
                  <td class="tit">{{notice.TITLE}}</td>
                  <td class="w_12">{{notice.REG_NM}}</td>
                  <td>{{notice.PUBLIC_YN == 'Y' ? '공개' : '비공개'}}</td>
                  <td class="num">{{notice.REG_DT}}</td>
                  <td class="num">{{notice.MOD_DT}}</td>
                  <td class="text-center button">
                    <button type="button" class="btn" @click="goUpdate(notice.ARTICLE_SEQ);">
                      <img src="../../assets/images/edit_icon.svg" alt="수정">
                    </button>
                  </td>
                  <td class="text-center button">
                    <button type="button" class="btn" @click="goDelete(notice.ARTICLE_SEQ);">
                      <img src="../../assets/images/del_icon.svg" alt="삭제">
                    </button>
                  </td>
                  <td>
                  </td>
                </tr>
              </tbody>
            </table>
            <PageComponent :totalCount="this.noticeList.length" @paging-list="listPagingSet"/>
          </div>
  
        </div>
      </main>
    </div>
    <!-- <Footer /> -->
  </div>   
</template>

<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu'
import Footer from '../../layouts/Footer'
import PageComponent from '../../components/Pagination'

export default {
    components: {
      Header, 
      Footer, 
      SideMenu, 
      PageComponent
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    data(){
        return {
            noticeList: [],
            pageList: [],
            keyword: ''
        }
    },
    mounted() {
        console.log("MEMBER_ID =>"+this.user.MEMBER_ID);        
        //if(this.user.MEMBER_ID == undefined) {
        //    this.$swal("로그인을 해야 이용할 수 있습니다.");
        //    this.$router.push({path:'/adminLogin'}); 
        //}
    },
    created() {
        this.goList(); 
    },
    methods:{
        async goList(){
            try{
                this.noticeList = await this.$api("/apirole/noticeList", {param:this.keyword});
                console.log("this.noticeList =>" + this.noticeList);
                console.log("this.keyword" + this.keyword);
            }catch(e){
                this.$swal("로그인을 해야 이용할 수 있습니다.");
                this.$router.push({path:'/adminLogin'});
            }
        },
        goUpdate(article_seq){
            this.$router.push({path:'/noticeUpdate', query:{article_seq:article_seq}});
        },
        goRegist() {
            this.$router.push({path:'/noticeRegist'}); 
        },
        getGroupNm(value) {
            let groupNm ="";
            if(value=="1"){
                groupNm = "관리자";
            }else{
                groupNm = "일반";
            }
            return groupNm;
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
                await this.$api("/apirole/noticeDelete",{param:[this.user.MEMBER_ID, article_seq]});
                this.goList();
                this.$swal.fire('삭제되었습니다!', '', 'success')
                } 
            });
        },
        //페이징처리
        listPagingSet(data){
            this.pageList = this.noticeList.slice(data[0], data[1]);
        }
    }
}
</script>
