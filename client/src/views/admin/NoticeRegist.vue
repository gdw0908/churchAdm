<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">공지사항</h2>
        <div class="container inner">
        <article class="input_box">
          <label>제목</label>
          <input type="text" class="form-control" ref="subject" v-model="notice.TITLE" placeholder="제목을 입력해주세요.">
        </article>
        <article class="input_box">
          <label>작성자</label>
          <input type="text" class="form-control" ref="writer" v-model="notice.REG_ID" placeholder="작성자 아이디를 입력해주세요.">
        </article>

        <article class="input_box">
          <label>내용</label>
          <textarea class="content_textarea" rows="20" v-model="editorData" placeholder="내용을 입력해주세요."></textarea>
        </article>

        <article class="private_wrap">
          <div class="switch_wrap">
            <input type='checkbox' class='toggle_switch' id='private' v-model="notice.PUBLIC_YN" true-value="N" false-value="Y">
            <label class='switch-btn' for='private'></label>
          </div>
          <div>
            <label for="private" v-show="notice.PUBLIC_YN == 'N' ">비공개 글로 설정되었습니다.</label>
            <label for="private" v-show="notice.PUBLIC_YN == 'Y' ">선택 시 비공개글로 설정됩니다.</label>
          </div>
        </article>

        <article class="notice_btn">
          <button type="button" class="notice_btn ro_btn gray"  @click="goToList">취소하기</button>
          <button type="button" class="notice_btn ro_btn"  @click="noticeInsert">저장하기</button>
        </article>
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
    user () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      notice: {
        TITLE: '',
        PUBLIC_YN: 'Y',
        CONTS: '',
        REG_ID: ''
      },
      upFileNm: '',
      fileData: [],
      isPublicYn1: true,
      isPublicYn2: false,
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        extraPlugins: [this.MyCustomUploadAdapterPlugin]
      }
    }
  },
  mounted () {
    if (this.user.MEMBER_ID === undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/noticeLogin' })
    } else {
      this.notice.REG_ID = this.user.MEMBER_ID
    }

    if (this.$route.path === '/noticeUpdate') {
      this.getNoticeInfo()
    }
  },
  methods: {
    goToList () {
      this.$router.push({ path: '/noticeList' })
    },

    async getNoticeInfo () {
      const noticeInfo = await this.$api('/apirole/noticeInfo', { param: [this.$route.query.article_seq] })
      console.log('noticeInfo[0] =>' + noticeInfo[0])
      if (noticeInfo.length > 0) {
        this.notice = noticeInfo[0]
        this.editorData = this.notice.CONTS
      }
    },
    MyCustomUploadAdapterPlugin (editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
      }
    },

    noticeInsert () {
      if (!this.notice.TITLE) {
        return this.$swal('제목은 필수 입력값입니다.', this.$refs.subject.focus())
      }
      if (!this.notice.REG_ID) {
        return this.$swal('작성자 아이디는 필수 입력값입니다.', this.$refs.writer.focus())
      }
      if (!this.editorData) {
        return this.$swal('내용은 필수 입력값입니다.')
      }
      this.notice.CONTS = this.editorData

      if (this.$route.path === '/noticeRegist') {
        this.$swal.fire({
          title: '정말 등록 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '등록',
          cancelButtonText: '취소'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setTimeout(() => {
                if (this.$route.path === '/noticeRegist') {
                  this.$api('/apirole/noticeInsert', { param: [this.notice] })
                }
                this.$swal.fire('저장되었습니다!', '', 'success')
                this.$router.push({ path: '/noticeList' })
              }, 300)
            } catch (e) {
              console.log('error==' + e)
              return this.$swal('처리 중 오류가 발생했습니다.')
            }
          }
        })
      } else {
        this.$swal.fire({
          title: '수정 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '수정',
          cancelButtonText: '취소'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$api('/apirole/noticeUpdate', {
                param: [
                  this.notice.TITLE,
                  this.notice.CONTS,
                  this.notice.PUBLIC_YN,
                  this.user.MEMBER_ID,
                  this.$route.query.article_seq
                ]
              })
              this.$swal.fire('저장되었습니다!', '', 'success')
              this.$router.push({ path: '/noticeList' })
            } catch (e) {
              console.log('error==' + e)
              return this.$swal('처리 중 오류가 발생했습니다.')
            }
          }
        })
      }
    }
  }
}
</script>
