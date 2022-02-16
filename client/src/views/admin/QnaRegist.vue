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
          <!-- <div class="mb-3 row">
            <label class="col-md-3 col-form-label ">작성자</label>
            <div class="col-md-5">
              <div class="input-group mb-3">
                <input type="text" class="form-control" ref="writer" v-model="qna.REG_NM">
              </div>
            </div>
          </div> -->
          <!-- <div class="mb-3 row">
            <label class="col-md-3 col-form-label ">비밀번호</label>
            <div class="col-md-5">
              <div class="input-group mb-3">
                <input type="password" class="form-control" ref="password" v-model="qna.PASSWORD">
              </div>
            </div>
          </div> -->

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
      //console.log("이값나오나시험=="+this.$route.query.qna_seq);
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
      // this.qna.FILE_NM = this.upFileNm;
      // var delFiles = [];
      // var saveFile = this.qna.FILE_NM ;       
      //저장된 파일과 중복된파일 제거
      // for(var i=0; i<this.fileData.length; i++){
      //   if(String(this.fileData[i]).trim()!==String(saveFile).trim()){
      //     delFiles.push(this.fileData[i]);
      //   }
      // }
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
                // if(delFiles.length>0){
                //   this.$api("/upload/deleteFile",{param:[delFiles, "images"]}); //저장안된 이미지파일 삭제 요청              
                // }
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
                // if(delFiles.length>0){
                //   this.$api("/upload/deleteFile",{param:[delFiles, "images"]}); //저장안된 이미지파일 삭제 요청              
                // }
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
              // if(delFiles.length>0){
              //     this.$api("/upload/deleteFile",{param:[delFiles, "images"]}); //저장안된 이미지파일 삭제 요청              
              // }
              this.$router.push({path:'/qnaList'});
            }catch(e){
              console.log("error=="+e)
            }
          }         
        });        
      }
    },
    // async uploadFile(files) {
    //   let name = "";
    //   let data = null;
    //   if (files) {
    //     name = files[0].name;
    //     this.fileData.push(files[0].name);
    //     data = await this.$base64(files[0]);
    //   }
    //   const { error } = await this.$api(`/upload/files/${name}`,{data});
    //   if (error) {
    //     return this.$swal("파일 업로드 실패했습니다. 다시 시도하세요.");
    //   }
    //   this.$swal("파일이 업로드 되었습니다.");
    //   setTimeout(() => {
    //     this.upFileNm = name;
    //     //this.imageYn = true;
    //   }, 1000);
    // }
      
  }
}
</script>