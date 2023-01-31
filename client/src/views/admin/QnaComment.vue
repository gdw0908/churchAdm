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
            <div class="con">{{ qna.CONTS }}</div>
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

        <div :class="['container inner ans', active === true ? 'none' : '']">
          <article class="input_box textarea_wrap">
            <label v-if="active === false">답변하기</label>
            <div :class="['answer_box', active === true ? 'active' : '']">
              <div class="answer_top" v-if="active === true">
                <span>{{ qna.MOD_DT }}에 답변완료</span>
                <button class="answer_btn" @click="answerEdit">
                  <img src="../../assets/images/edit_w_icon.svg" alt="수정">
                </button>
              </div>
              <textarea :class="['content_textarea', active === true ? 'active' : '']" :disabled="active" rows="8" maxlength="1000" placeholder="답변을 입력해주세요." v-model="editorData"></textarea>

            </div>
            <p class="byte" v-if="editorData === null === true">글자수 제한: (0/1000)</p>
            <p class="byte" v-if="editorData !== null === true">글자수 제한: ({{ editorData.length }}/1000)</p>
          </article>
          <button type="button" class="ro_btn" @click="qnaInsert" v-if="active === false">답변완료</button>
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
        PUBLIC_YN: 'Y',
        RE_CONTS: '',
        REG_ID: '',
        VIEW_CNT: 0
      },
      isPublicYn1: true,
      isPublicYn2: false,
      editor: ClassicEditor,
      editorData: [],
      editorConfig: {
        extraPlugins: [this.MyCustomUploadAdapterPlugin]
      },
      active: false
    }
  },
  mounted () {
    if (this.user.MEMBER_ID === undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/qnaLogin' })
    } else {
      this.qna.REG_ID = this.user.MEMBER_ID
    }
    console.log('$route.path===' + this.$route.path)
    if (this.$route.path === '/qnaReply') {
      this.getQnaInfo()
    }

    console.log(this.qna.PUBLIC_YN)
  },
  methods: {
    goToList () {
      this.$router.push({ path: '/qnaList' })
    },
    async getQnaInfo () {
      const qnaInfo = await this.$api('/apirole/qnaInfo', { param: [this.$route.query.article_seq] })
      console.log('qnaInfo[0]==' + qnaInfo[0])
      if (qnaInfo.length > 0) {
        this.qna = qnaInfo[0]
        this.editorData = this.qna.RE_CONTS
        // if (this.$route.path === '/qnaReply') {
        //   // eslint-disable-next-line no-self-assign
        //   this.qna.TITLE = this.qna.TITLE
        //   console.log('this.editorData==' + this.editorData)
        // }
      }

      if (this.editorData) {
        this.active = true
      }
    },
    MyCustomUploadAdapterPlugin (editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
      }
    },
    qnaInsert () {
      this.qna.RE_CONTS = this.editorData
      if (!this.qna.RE_CONTS) {
        return this.$swal('답변을 입력해 주세요.')
      }

      if (this.$route.path === '/qnaReply') {
        this.$swal.fire({
          title: '답변을 등록 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '수정',
          cancelButtonText: '취소'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$api('/apirole/qnaComment', {
                param: [
                  this.qna.TITLE,
                  this.qna.RE_CONTS,
                  this.qna.REG_NM,
                  this.qna.PASSWORD,
                  this.qna.PUBLIC_YN,
                  this.user.MEMBER_ID,
                  this.$route.query.article_seq
                ]
              })
              this.$swal.fire('저장되었습니다!', '', 'success')
              this.$router.push({ path: '/qnaList' })
            } catch (e) {
              console.log('error==' + e)
            }
          }
        })
      }
    },
    // 수정 아이콘 클릭시 답변 새로 작성 가능
    answerEdit () {
      this.active = false
    }
  }
}
</script>
