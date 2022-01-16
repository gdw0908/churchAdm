<template>
<div>
  <Header />
  <main class="mt-3">    
    <div class="container">
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th scope="col">순번</th>
                    <th scope="col">아이디</th>
                    <th scope="col">이름</th>
                    <th scope="col">회원구분</th>
                    <th scope="col">이메일</th>
                    <th scope="col">등록일자</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr :key="i" v-for="(admin,i) in pageList">
                    <th scope="row">{{admin.ROWNUM}}</th>
                    <td>{{admin.MEMBER_ID}}</td>
                    <td>{{admin.MEMBER_NM}}</td>
                    <td>{{getGroupNm(admin.GROUP_SEQ)}}</td>
                    <td>{{admin.EMAIL}}</td>
                    <td>{{admin.REG_DT}}</td>
                    <td>
                      <button type="button" class="btn btn-info me-1" @click="goUpdate(admin.MEMBER_ID);">수정</button>
                      <button type="button" class="btn btn-danger" @click="goDelete(admin.MEMBER_ID);">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <PageComponent :totalCount="this.adminList.length" @paging-list="listPagingSet"/>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-outline-secondary" type="button" @click="goRegist()">등록</button>
        </div>
    </div>
  </main>
  <Footer />
</div>
</template>


<script>
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import PageComponent from '../../components/Pagination'

export default {
    components: {Header, Footer, PageComponent},
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    data() {
        return {
            adminList: [],
            pageList: []
        };
    },
    created() {
        this.goList(); 
    },
    mounted() {
        if(this.user.MEMBER_ID == undefined) {
            this.$swal("로그인을 해야 이용할 수 있습니다.");
            this.$router.push({path:'/adminLogin'}); 
        }
    },
    methods: {
        async goList() {
            try{
                this.adminList = await this.$api("/apirole/adminList",{});
                console.log("this.adminList==="+this.adminList.length);
                //this.$refs.childComponent.paginatedData();
            }catch(e){
                this.$swal("로그인을 해야 이용할 수 있습니다.");
                this.$router.push({path:'/adminLogin'}); 
            }            
        },
        goUpdate(member_id) {
            this.$router.push({path:'/adminUpdate', query:{member_id:member_id}}); 
        },
        goRegist() {
            this.$router.push({path:'/adminRegist'}); 
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
        goDelete(membber_id) {
            this.$swal.fire({
                title: '정말 삭제하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: `삭제`,
                cancelButtonText: `취소`
            }).then(async (result) => {
                if (result.isConfirmed) {
                console.log(membber_id)
                await this.$api("/apirole/adminDelete",{param:[this.user.MEMBER_ID,membber_id]});
                this.goList();
                this.$swal.fire('삭제되었습니다!', '', 'success')
                } 
            });
        },
        listPagingSet(data){
            this.pageList=this.adminList.slice(data[0], data[1]);
            //console.log("this.adminList lenth=="+this.adminList.length);
        }
    }

}
</script>