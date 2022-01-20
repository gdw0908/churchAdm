<template>
<div>
  <Header />
  <main class="mt-3">    
    <div class="container">
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th scope="col">순번</th>
                    <th scope="col">제목</th>
                    <th scope="col">등록자</th>
                    <th scope="col">공개여부</th>
                    <th scope="col">등록일자</th>
                    <th scope="col">수정일자</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr :key="i" v-for="(notice,i) in noticeList">
                    <th scope="row">{{notice.ROWNUM}}</th>
                    <td>{{notice.SUBJECT}}</td>
                    <td>{{notice.WRITER}}</td>
                    <td>{{notice.PUBLIC_YN == 'Y' ? '공개' : '비공개'}}</td>
                    <td>{{notice.REG_DT}}</td>
                    <td>{{notice.MOD_DT}}</td>
                    <td>
                      <button type="button" class="btn btn-info me-1" @click="goUpdate(notice.NOTICE_SEQ);">수정</button>
                      <button type="button" class="btn btn-danger" @click="goDelete(notice.NOTICE_SEQ);">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <PageComponent :totalCount="this.noticeList.length" @paging-list="listPagingSet"/>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-outline-secondary" type="button" @click="goRegist()">등록</button>
        </div>
    </div>
  </main>
  <Footer />
</div>   
</template>

<script>
import Header from '../../layouts/Header.vue'
import Footer from '../../layouts/Footer.vue'
import PageComponent from '../../components/Pagination'

export default {
    components: {Header, Footer, PageComponent},
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    data(){
        return {
            noticeList: []
        }
    },
    mounted() {
        console.log("MEMBER_ID =>"+this.user.MEMBER_ID);        
        if(this.user.MEMBER_ID == undefined) {
            this.$swal("로그인을 해야 이용할 수 있습니다.");
            this.$router.push({path:'/adminLogin'}); 
        }
    },
    created() {
        this.goList(); 
    },
    methods:{
        async goList(){
            try{
                this.noticeList = await this.$api("/apirole/noticeList", {});
                console.log(this.noticeList);
            }catch(e){
                this.$swal("로그인을 해야 이용할 수 있습니다.");
                this.$router.push({path:'/adminLogin'});
            }
        },
        goUpdate(notice_seq){
            this.$router.push({path:'/noticeUpdate', query:{notice_seq:notice_seq}});
            console.log("notice_seq ==> " + notice_seq);
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
        goDelete(notice_seq) {
            this.$swal.fire({
                title: '정말 삭제하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: `삭제`,
                cancelButtonText: `취소`
            }).then(async (result) => {
                if (result.isConfirmed) {
                console.log(notice_seq)
                await this.$api("/apirole/noticeDelete",{param:[this.user.MEMBER_ID, notice_seq]});
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
