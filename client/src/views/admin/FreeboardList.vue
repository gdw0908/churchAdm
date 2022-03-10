<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">자유게시판</h2>
        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">자유게시판 관리</h3>

            <article class="search_wrap">
              <div class="search_box">
                <input type="text" class="form-control" ref="keyword" v-model="keyword" placeholder="제목이나 내용을 검색해주세요." @keyup.enter="goList">
                <button class="search_btn" type="button" @click="goList">
                  <img src="../../assets/images/search_icon.svg" alt="검색">
                </button>
              </div>
            </article>
          </section>

          <LoadingSpinner v-if="isLoding" />

          <article class="table_container" v-else>
            <div class="table_wrap">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Writer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Church</th>
                    <th scope="col" class="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(freeboard,i) in pageList" style="cursor:pointer;">
                    <td scope="row" @click="goDetail(freeboard.ARTICLE_SEQ)">{{freeboard.ROWNUM}}</td>
                    <td class="tit" @click="goDetail(freeboard.ARTICLE_SEQ)">{{freeboard.TITLE}}</td>
                    <td @click="goDetail(freeboard.ARTICLE_SEQ)">{{freeboard.REG_NM}}</td>
                    <td class="num w_20" @click="goDetail(freeboard.ARTICLE_SEQ)">{{freeboard.REG_DT}}</td>
                    <td class="w_20" @click="goDetail(freeboard.ARTICLE_SEQ)">{{freeboard.CHURCH_NM}}</td>
                    <td class="text-center button">
                      <button type="button" class="btn" @click="goDelete(freeboard.ARTICLE_SEQ);">
                        <img src="../../assets/images/del_icon.svg" alt="삭제">
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent :totalCount="this.freeboardList.length" @paging-list="listPagingSet"/>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            </div>
          </article>
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
      freeboardList: [],
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
    if (this.user.MEMBER_ID == undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    }
  },
  methods: {
    async goList () {
      try {
        this.isLoding = true
        this.freeboardList = await this.$api('/apirole/freeboardList', {
          param: [
            this.keyword,
            this.user.CODE
          ]
        })
        this.isLoding = false
        console.log('this.freeboardList =>' + JSON.stringify(this.freeboardList))
        console.log('this.keyword' + this.keyword)
      } catch (e) {
        console.log('error==' + e)
      }
    },
    goDetail (article_seq) {
      this.$router.push({ path: '/freeboardDetail', query: { article_seq: article_seq } })
    },
    goUpdate (article_seq) {
      this.$router.push({ path: '/freeboardUpdate', query: { article_seq: article_seq } })
    },
    getGroupNm (value) {
      let groupNm = ''
      if (value == '1') {
        groupNm = '관리자'
      } else {
        groupNm = '일반'
      }
      return groupNm
    },
    goDelete (article_seq) {
      this.$swal.fire({
        title: '정말 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(article_seq)
          await this.$api('/apirole/freeboardDelete', { param: [this.user.MEMBER_ID, article_seq] })
          this.goList()
          this.$swal.fire('삭제되었습니다!', '', 'success')
        }
      })
    },
    listPagingSet (data) {
      this.pageList = this.freeboardList.slice(data[0], data[1])
    }
  }
}
</script>
