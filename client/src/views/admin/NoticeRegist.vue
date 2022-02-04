<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <div class="container">
        <h2 class="text-center fs-3 fw-bold">공지사항 등록</h2>
        <div class="mb-3 row">
          <label class="col-md-3 col-form-label ">제목</label>
          <div class="col-md-5">
            <div class="input-group mb-3">
              <input type="text" class="form-control" ref="subject" v-model="notice.SUBJECT">
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-md-3 col-form-label ">작성자</label>
          <div class="col-md-5">
            <div class="input-group mb-3">
              <input type="text" class="form-control" ref="writer" v-model="notice.WRITER">
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-md-3 col-form-label ">비공개</label>
          <div class="col-md-5">
            <div class="input-group mb-3">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" v-model="notice.PUBLIC_YN" id="flexSwitchCheckChecked" true-value="N" false-value="Y">
                <label class="form-check-label fs-7" for="flexSwitchCheckChecked" v-show="notice.PUBLIC_YN == 'N' ">비공개 글로 설정되었습니다.</label>
                <label class="form-check-label fs-7" for="flexSwitchCheckChecked" v-show="notice.PUBLIC_YN == 'Y' ">선택 시 비공개글로 설정됩니다.</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-md-3 col-form-label ">내용</label>
          <div class="col-md-5">
            <div class="input-group mb-3">
              <ckeditor ref="editorRef" :editor="editor" v-model="editorData" :config="editorConfig" ></ckeditor>
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <label class="col-md-3 col-form-label ">첨부파일</label>
          <div class="col-md-9">
            <div class="input-group mb-3">
              <input type="file" class="form-control me-1" ref="file_nm" @change="uploadFile($event.target.files)">
              <li class="fs-5 fw-bold"><a :href="`/download/files/${this.upFileNm}`" target="_blank">{{this.upFileNm}}</a></li>
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col-6 d-grid p-1">
            <button type="button" class="btn btn-lg btn-dark" @click="goToList">취소하기</button>
          </div>
          <div class="col-6 d-grid p-1">
            <button type="button" class="btn btn-lg btn-danger" @click="noticeInsert">저장하기</button>
          </div>
        </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../../layouts/Header.vue'
import SideMenu from '../../layouts/SideMenu' 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadAdapter from '../../utils/UploadAdapter'

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
  data(){
    return {
      notice: {
        SUBJECT: "",
        WRITER: "",
        PUBLIC_YN: "N",
        CONTENTS: "",
        FILE_NM: "",
        REG_ID: ""
      },
      upFileNm : "",
      fileData : [],
      isPublicYn1 : true,
      isPublicYn2 : false,
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // The configuration of the editor.
        //toolbar: [ 'bold', 'italic', '|', 'link' ]   
        extraPlugins: [this.MyCustomUploadAdapterPlugin]            
      }
    }
  },
  mounted() {
    if(this.user.MEMBER_ID == undefined) {
      this.$swal("로그인을 해야 이용할 수 있습니다.");
      this.$router.push({path:'/noticeLogin'}); 
    }else{
      this.notice.REG_ID = this.user.MEMBER_ID;
    }

    if(this.$route.path=="/noticeUpdate"){
      this.getNoticeInfo();
    }
  },
  methods: {
    goToList(){
      this.$router.push({path:'/noticeList'});
    },
    async getNoticeInfo(){
      let noticeInfo = await this.$api("/apirole/noticeInfo", {param:[this.$route.query.notice_seq]});
      console.log("noticeInfo[0] =>" + noticeInfo[0]);
      if(noticeInfo.length > 0){
        this.notice = noticeInfo[0];
        this.upFileNm = this.notice.FILE_NM;
        this.editorData = this.notice.CONTENTS;
      }
    },
    MyCustomUploadAdapterPlugin(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
      }
    },
    noticeInsert(){
      if(!this.notice.SUBJECT) {
        return this.$swal("제목은 필수 입력값입니다.", this.$refs.subject.focus());
      }
      if(!this.notice.WRITER) {
        return this.$swal("작성자는 필수 입력값입니다.", this.$refs.writer.focus());
      }
      if(!this.editorData) {
        return this.$swal("내용은 필수 입력값입니다.");
      }
      this.notice.CONTENTS = this.editorData;
      this.notice.FILE_NM = this.upFileNm;
      var delFiles = [];
      var saveFile = this.notice.FILE_NM;
      //저장된 파일, 중복된 파일 제거
      for(var i = 0; i < this.fileData.length; i++){
        if(String(this.fileData[i].trim() !== String(saveFile).trim())){
          delFiles.push(this.fileData[i]);
        }
      }

      if(this.$route.path == "/noticeRegist") {
        this.$swal.fire({
          title: '정말 등록 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `생성`,
          cancelButtonText: `취소`
        }).then(async (result) => {
          if(result.isConfirmed) {
            try{          
              setTimeout(() => {
                if(this.$route.path=="/noticeRegist"){
                  this.$api("/apirole/noticeInsert",{param:[this.notice]});
                }
                this.$swal.fire('저장되었습니다!', '', 'success');

                if(delFiles.length>0){
                  this.$api("/upload/deleteFile",{param:[delFiles, "images"]}); //저장안된 이미지파일 삭제 요청              
                }
                this.$router.push({path:'/noticeList'});

              }, 300);
              }catch(e){
              console.log("error=="+e)              
              return this.$swal("처리 중 오류가 발생했습니다.");
            }
          }         
        });
      } else{
        this.$swal.fire({
          title: '수정 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `수정`,
          cancelButtonText: `취소`
        }).then(async (result) => {
          if(result.isConfirmed) {
            try{
              await this.$api("/apirole/noticeUpdate",{param:[
                this.notice.SUBJECT,
                this.notice.CONTENTS,
                this.notice.WRITER,
                this.notice.PUBLIC_YN,
                this.notice.FILE_NM,
                this.user.MEMBER_ID,
                this.$route.query.notice_seq
              ]});
              this.$swal.fire('저장되었습니다!', '', 'success');
              if(delFiles.length>0){
                this.$api("/upload/deleteFile",{param:[delFiles, "images"]}); //저장안된 이미지파일 삭제 요청              
              }
              this.$router.push({path:'/noticeList'});
            }catch(e){
              console.log("error=="+e)
              return this.$swal("처리 중 오류가 발생했습니다.");
            }
          }         
        });
      }
    },
    async uploadFile(files){
      let name = "";
      let data = null;
      if(files){
        name = files[0].name;
        this.fileData.push(files[0].name);
        data = await this.$base64(files[0]);
      }
      const { error } = await this.$api(`/upload/files/${name}`, {data});
      if(error) {
        return this.$swal("파일 업로드 실패했습니다. 다시 시도하세요.");
      }
      this.$swal("파일이 업로드 되었습니다.");
      setTimeout(() => {
        this.upFileNm = name;
      }, 1000);
    }
  }
}
</script>
