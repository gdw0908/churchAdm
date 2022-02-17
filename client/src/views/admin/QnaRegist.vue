<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">1:1 문의</h2>
        <div class="container inner">
          <article class="user_qna_wrap">
            <h3 class="tit">{{ qna.TITLE }}</h3>
            <div class="con">{{ qna.CONTENTS }}</div>
          </article>

          <article class="private_wrap">
            <div class="switch_wrap">
              <input type='checkbox' class='toggle_switch' id='private' v-model="qna.PUBLIC_YN" true-value="N" false-value="Y">
              <label class='switch-btn' for='private'></label>
            </div>
            <div>
              <label for="private" v-show="qna.PUBLIC_YN == 'N' ">비공개 글로 설정되었습니다.</label>
              <label for="private" v-show="qna.PUBLIC_YN == 'Y' ">선택 시 비공개글로 설정됩니다.</label>
            </div>
          </article>
        </div>

        <div class="container inner ans">
          <article class="input_box">
            <label>답변하기</label>
            <textarea class="content_textarea" rows="15" placeholder="답변을 입력해주세요."></textarea>
          </article>
          <button type="button" class="notice_btn ro_btn" @click="qnaInsert">답변완료</button>
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
    Header, 
    SideMenu 
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
        CONTS: '',
        REG_ID: '',
        VIEW_CNT: 0
      },
      replyQna: {
        TITLE: '',
        REG_NM: '',
        PASSWORD: '',
        PUBLIC_YN: 'N',
        RE_CONTS: '',
        REG_ID: ''
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
    if(this.user.MEMBER_ID == undefined) {
      this.$swal("로그인을 해야 이용할 수 있습니다.");
      this.$router.push({path:'/qnaLogin'}); 
    }else{
      this.qna.REG_ID = this.user.MEMBER_ID;
    }
    console.log("$route.path==="+this.$route.path);
    if(this.$route.path=="/qnaUpdate" || this.$route.path=="/qnaReply"){
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
        this.editorData=this.qna.CONTS;
        
        if(this.$route.path=="/qnaReply"){
          this.qna.SUBJECT = "[RE] "+this.qna.SUBJECT;
          this.editorData = "<p><br data-cke-filler='true'></p><p>답변 : </p>";
          console.log("this.editorData=="+this.editorData);``
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
      if(!this.editorData) {
        return this.$swal("내용은 필수 입력값입니다.");
      }
      this.qna.CONTS = this.editorData;

      if(this.$route.path=="/qnaRegist"){                    
        this.$swal.fire({
          title: '정말 등록 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `생성`,
          cancelButtonText: `취소`
        }).then(async (result) => {
          if(result.isConfirmed) {
            try{              
              if(this.$route.path=="/qnaRegist"){
                let parentSeq = await this.$api("/apirole/qnaParentSeq",{param:""});
                console.log("parentSeq=="+parentSeq[0].ARTICLE_SEQ);
                this.qna.ARTICLE_SEQ = parentSeq[0].ARTICLE_SEQ;
              }else{                 
                this.replyQna.ARTICLE_SEQ=this.qna.ARTICLE_SEQ;
                this.replyQna.TITLE=this.qna.TITLE;
                this.replyQna.REG_NM=this.qna.REG_NM;
                this.replyQna.PUBLIC_YN=this.qna.PUBLIC_YN;
                this.replyQna.RE_CONTS=this.qna.RE_CONTS;
                this.replyQna.REG_ID=this.qna.REG_ID;
              }
              setTimeout(() => {
                if(this.$route.path=="/qnaRegist"){
                  this.$api("/apirole/qnaInsert",{param:[this.qna]});
                }else{
                  this.$api("/apirole/qnaInsert",{param:[this.replyQna]});
                }
                this.$swal.fire('저장되었습니다!', '', 'success');
                this.$router.push({path:'/qnaList'});
              }, 300);
            }catch(e){
              console.log("error=="+e)
            }
          }         
        });
      } else if(this.$route.path=="/qnaReply"){                    
        this.$swal.fire({
          title: '답변을 등록 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `생성`,
          cancelButtonText: `취소`
        }).then(async (result) => {
          if(result.isConfirmed) {
            try{              
              this.replyQna.ARTICLE_SEQ=this.qna.ARTICLE_SEQ;
              this.replyQna.TITLE=this.qna.TITLE;
              this.replyQna.REG_NM=this.qna.REG_NM;
              this.replyQna.PUBLIC_YN=this.qna.PUBLIC_YN;
              this.replyQna.RE_CONTS=this.qna.RE_CONTS;
              this.replyQna.REG_ID=this.qna.REG_ID;
              setTimeout(() => {
                this.$api("/apirole/qnaUpdate",{param:[this.replyQna]});

                this.$swal.fire('저장되었습니다!', '', 'success');
                this.$router.push({path:'/qnaList'});
              }, 300);
            }catch(e){
              console.log("error=="+e)
            }
          }         
        });
      }else{
        this.$swal.fire({
          title: '수정 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `수정`,
          cancelButtonText: `취소`
        }).then(async (result) => {
          if(result.isConfirmed) {
            try{
              await this.$api("/apirole/qnaUpdate",{param:[
                this.qna.TITLE,
                this.qna.CONTS,
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
    },
  }
}
</script>