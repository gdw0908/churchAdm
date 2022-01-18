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
                <tr :key="i" v-for="(qna,i) in qnaList">
                    <th scope="row">{{qna.ROWNUM}}</th>
                    <td>{{qna.LVL == 1 ? 'RE : ' : ''}}{{qna.SUBJECT}}</td>
                    <td>{{qna.WRITER}}</td>
                    <td>{{qna.PUBLIC_YN == 'Y' ? '공개' : '비공개'}}</td>
                    <td>{{qna.REG_DT}}</td>
                    <td>{{qna.MOD_DT}}</td>
                    <td>
                      <button v-if="qna.REPLY_CNT == 1" type="button" class="btn btn-info me-1 btn-warning" @click="goReple(qna.QNA_SEQ);">답글등록</button>
                      <button type="button" class="btn btn-info me-1" @click="goUpdate(qna.QNA_SEQ);">수정</button>
                      <button type="button" class="btn btn-danger" @click="goDelete(qna.QNA_SEQ);">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
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

export default {
    components: {Header, Footer},
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    data() {
        return {
        qnaList: []
        };
    },
    created() {
        this.goList(); 
    },
    mounted() {
        console.log("1111=="+this.user.MEMBER_ID);        
        if(this.user.MEMBER_ID == undefined) {
            this.$swal("로그인을 해야 이용할 수 있습니다.");
            this.$router.push({path:'/adminLogin'}); 
        }
    },
    methods: {
        async goList() {
            try{
                this.qnaList = await this.$api("/apirole/qnaList",{});
            }catch(e){
                this.$swal("로그인을 해야 이용할 수 있습니다.");
                this.$router.push({path:'/adminLogin'}); 
            }            
        },
        goUpdate(qna_seq) {
            this.$router.push({path:'/qnaUpdate', query:{qna_seq:qna_seq}}); 
        },
        goReple(qna_seq) {
            this.$router.push({path:'/qnaReply', query:{qna_seq:qna_seq}}); 
        },        
        goRegist() {
            this.$router.push({path:'/qnaRegist'}); 
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
        goDelete(qna_seq) {
            this.$swal.fire({
                title: '정말 삭제하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: `삭제`,
                cancelButtonText: `취소`
            }).then(async (result) => {
                if (result.isConfirmed) {
                console.log(qna_seq)
                await this.$api("/apirole/qnaDelete",{param:[this.user.MEMBER_ID, qna_seq]});
                this.goList();
                this.$swal.fire('삭제되었습니다!', '', 'success')
                } 
            });
        }
    }
}
</script>