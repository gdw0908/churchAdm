<template>
    <div>
        <SideMenu />
        <div class="main_container">
            <Header />
            <main class="main_wrap">
                <div class="container">
                <h2 class="text-center fs-3 fw-bold">1:1문의 답글등록</h2>
                <div class="mb-3 row">
                    <label class="col-md-3 col-form-label ">제목</label>
                    <div class="col-md-5">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" ref="subject" v-model="qna.TITLE">
                    </div>
                    </div>
                </div>
                <div class="mb-3 row">
                    <label class="col-md-3 col-form-label ">작성자</label>
                    <div class="col-md-5">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" ref="writer" v-model="qna.REG_NM">
                    </div>
                    </div>
                </div>
                <div class="mb-3 row">
                    <label class="col-md-3 col-form-label ">비밀번호</label>
                    <div class="col-md-5">
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" ref="password" v-model="qna.PASSWORD">
                    </div>
                    </div>
                </div>
                <div class="mb-3 row">
                    <label class="col-md-3 col-form-label ">비공개</label>
                    <div class="col-md-5">
                    <div class="input-group mb-3">
                        <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" v-model="qna.PUBLIC_YN" id="flexSwitchCheckChecked" true-value="N" false-value="Y">
                        <label class="form-check-label fs-7" for="flexSwitchCheckChecked" v-show="qna.PUBLIC_YN == 'N' ">비공개 글로 설정되었습니다.</label>
                        <label class="form-check-label fs-7" for="flexSwitchCheckChecked" v-show="qna.PUBLIC_YN == 'Y' ">선택 시 비공개글로 설정됩니다.</label>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mb-3 row">
                    <label class="col-md-3 col-form-label ">내용</label>
                    <div class="col-md-5">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="qna.CONTS">
                    </div>
                    </div>
                </div>
                <div class="mb-3 row">
                    <label class="col-md-3 col-form-label ">답변</label>
                    <div class="col-md-5">
                    <div class="input-group mb-3">
                        <ckeditor ref="editorRef" :editor="editor" v-model="editorData" :config="editorConfig" ></ckeditor>
                    </div>
                    </div>
                </div>
                <div class="mb-3 row">
                    <div class="col-6 d-grid p-1">
                    <button type="button" class="btn btn-lg btn-dark" @click="goToList">취소하기</button>
                    </div>
                    <div class="col-6 d-grid p-1">
                    <button type="button" class="btn btn-lg btn-danger" @click="qnaInsert">저장하기</button>
                    </div>
                </div>
                </div>
            </main>
        </div>
    </div>
</template>
<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu' 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadAdapter from '../../utils/UploadAdapter'

export default {
  components: { 
        Header
      , SideMenu 
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      qna: {
        TITLE: '',
        REG_NM: '',
        PASSWORD: '',
        PUBLIC_YN: 'N',
        RE_CONTS: '',
        REG_ID: '',
        VIEW_CNT: 0
      },
      isPublicYn1 : true,
      isPublicYn2 : false,
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {  
          extraPlugins: [this.MyCustomUploadAdapterPlugin]            
      }
    };
  },
  mounted() {
    // if(this.user.MEMBER_ID == undefined) {
    //   this.$swal("로그인을 해야 이용할 수 있습니다.");
    //   this.$router.push({path:'/qnaLogin'}); 
    // }else{
    //   this.qna.REG_ID = this.user.MEMBER_ID;
    // }
    console.log("$route.path==="+this.$route.path);
    if(this.$route.path=="/qnaReply"){
      this.getQnaInfo();
    }
  },
  methods: {
    goToList(){
      this.$router.push({path:'/qnaList'}); 
    },   
    async getQnaInfo() {
      let qnaInfo = await this.$api("/apirole/qnaInfo",{param:[this.$route.query.article_seq]});
      console.log("qnaInfo[0]=="+qnaInfo[0]);      
      if(qnaInfo.length > 0) {
        this.qna = qnaInfo[0];
        this.editorData=this.qna.RE_CONTS;
        
        if(this.$route.path=="/qnaReply"){
          this.qna.TITLE = this.qna.TITLE;
          this.editorData = "답변 : ";
          console.log("this.editorData=="+this.editorData);
        }
      }
    },
    MyCustomUploadAdapterPlugin(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return new UploadAdapter(loader)
      }
    },    
    qnaInsert() {
      if(!this.qna.TITLE) {
        return this.$swal("제목은 필수 입력값입니다.", this.$refs.subject.focus());
      }
      if(!this.qna.REG_NM) {
        return this.$swal("작성자는 필수 입력값입니다.", this.$refs.writer.focus());
      }
      this.qna.RE_CONTS = this.editorData;

      if(this.$route.path=="/qnaReply"){
            this.$swal.fire({
                title: '답변을 등록 하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: `수정`,
                cancelButtonText: `취소`
            }).then(async (result) => {
                if(result.isConfirmed) {
                    try{
                        await this.$api("/apirole/qnaComment",{param:[
                            this.qna.TITLE,
                            this.qna.RE_CONTS,
                            this.qna.REG_NM,
                            this.qna.PASSWORD,
                            this.qna.PUBLIC_YN,
                            this.user.MEMBER_ID,
                            this.$route.query.article_seq
                        ]});
                        this.$swal.fire('저장되었습니다!', '', 'success');
                        this.$router.push({path:'/qnaList'});
                    }catch(e){
                        console.log("error=="+e)
                    }
                }         
            });        
        }
    }
  }
}
</script>