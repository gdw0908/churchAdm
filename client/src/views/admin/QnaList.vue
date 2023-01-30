<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">1:1 문의</h2>
        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">게시물 관리</h3>

            <article class="search_wrap">
              <div class="search_box">
                <input type="text" class="form-control" ref="keyword" v-model="keyword" placeholder="제목을 검색해주세요." @keyup.enter="goList">
                <button class="search_btn" type="button" @click="goList">
                  <img src="../../assets/images/search_icon.svg" alt="검색">
                </button>
              </div>
            </article>
          </section>

          <LoadingSpinner v-if="isLoding" />

          <div class="table_container" v-else>
            <div class="table_wrap">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Answer</th>
                    <th scope="col">Writer</th>
                    <th scope="col">Disclosure</th>
                    <th scope="col">Date</th>
                    <th scope="col">Answer Time</th>
                    <th scope="col">State</th>
                    <th scope="col" class="text-center">Edit</th>
                    <th scope="col" class="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(qna,i) in pageList">
                    <td scope="row">{{qna.ROWNUM}}</td>
                    <td class="tit">{{qna.TITLE}}</td>
                    <td class="tit">{{qna.RE_CONTS}}</td>
                    <td>{{qna.REG_NM}}</td>
                    <td>{{qna.PUBLIC_YN == 'Y' ? '공개' : '비공개'}}</td>
                    <td class="num w_15">{{qna.REG_DT}}</td>
                    <td class="num w_15">{{qna.MOD_DT}}</td>
                    <td class="num">
                      <button class="answer_state wait" v-if="qna.STATE == 1">답변완료</button>
                      <button class="answer_state complete" v-else>답변대기</button>
                    </td>
                    <td class="text-center button">
                      <button type="button" class="btn" @click="goReple(qna.ARTICLE_SEQ);">
                        <img src="../../assets/images/edit_icon.svg" alt="답글등록">
                      </button>
                    </td>
                    <td class="text-center button">
                      <button type="button" class="btn" @click="goDelete(qna.ARTICLE_SEQ);">
                        <img src="../../assets/images/del_icon.svg" alt="삭제">
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent :totalCount="this.qnaList.length" @paging-list="listPagingSet"/>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
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
import PageComponent from '../../components/Pagination'
import LoadingSpinner from '../../components/LoadingSpinner'

export default {
  components: {
    Header,
    SideMenu,
    PageComponent,
    LoadingSpinner
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      qnaList: [],
      pageList: [],
      keyword: '',
      isLoding: false
    }
  },
  created () {
    this.goList()
  },
  mounted () {
    console.log('1111==' + this.user.MEMBER_ID)
    if (this.user.MEMBER_ID === undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    }
  },
  methods: {
    async goList () {
      try {
        this.isLoding = true
        this.qnaList = await this.$api('/apirole/qnaList', {
          param: [
            this.keyword,
            this.user.CODE
          ]
        })
        this.isLoding = false
      } catch (e) {
        console.log('error==' + e)
      }
    },
    // eslint-disable-next-line camelcase
    goUpdate (article_seq) {
      this.$router.push({ path: '/qnaUpdate', query: { article_seq: article_seq } })
    },
    // eslint-disable-next-line camelcase
    goReple (article_seq) {
      this.$router.push({ path: '/qnaReply', query: { article_seq: article_seq } })
    },
    goRegist () {
      this.$router.push({ path: '/qnaRegist', query: { article_seq: article_seq } })
    },
    getGroupNm (value) {
      let groupNm = ''
      if (value === '1') {
        groupNm = '관리자'
      } else {
        groupNm = '일반'
      }
      return groupNm
    },
    // eslint-disable-next-line camelcase
    goDelete (article_seq) {
      this.$swal.fire({
        title: '정말 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(article_seq)
          await this.$api('/apirole/qnaDelete', { param: [this.user.MEMBER_ID, article_seq] })
          this.goList()
          this.$swal.fire('삭제되었습니다!', '', 'success')
        }
      })
    },
    listPagingSet (data) {
      this.pageList = this.qnaList.slice(data[0], data[1])
    }
  }
}
</script>
