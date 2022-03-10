<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">교회 관리</h2>

        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">교회 목록</h3>

            <article class="search_wrap">
              <div class="search_box">
                <input
                  type="text"
                  class="form-control"
                  ref="keyword"
                  v-model="keyword"
                  placeholder="아이디나 이름을 검색해주세요."
                  @keyup.enter="goList"
                />
                <button class="search_btn" type="button" @click="goList">
                  <img src="../../assets/images/search_icon.svg" alt="검색" />
                </button>
              </div>

              <button type="button" class="write_btn" @click="goRegist()">
                + 교회추가
              </button>
            </article>
          </section>

          <LoadingSpinner v-if="isLoding" />
          <div class="table_container" v-else>
            <div class="table_wrap">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">NO.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Code Number</th>
                    <th scope="col">Id</th>
                    <th scope="col">Manager</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Manager Contact</th>
                    <th scope="col">Location</th>
                    <th scope="col">Emaile</th>
                    <th scope="col">Date</th>
                    <th scope="col" class="text-center">Edit</th>
                    <th scope="col" class="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(admin, i) in pageList">
                    <td>{{ admin.ROWNUM }}</td>
                    <td>{{ admin.CHURCH_NM }}</td>
                    <td>{{ admin.CODE }}</td>
                    <td>{{ admin.MEMBER_ID }}</td>
                    <td>{{ admin.MEMBER_NM }}</td>
                    <td>{{ admin.CHURCH_CELL }}</td>
                    <td>{{ admin.MEMBER_CELL }}</td>
                    <td>{{ admin.LOCATION }}</td>
                    <td>{{ admin.EMAIL }}</td>
                    <td class="num w_20">{{ admin.REG_DT }}</td>
                    <td class="text-center button">
                      <button
                        type="button"
                        class="btn"
                        @click="goUpdate(admin.MEMBER_ID)"
                      >
                        <img
                          src="../../assets/images/edit_icon.svg"
                          alt="수정"
                        />
                      </button>
                    </td>
                    <td class="text-center button">
                      <button
                        type="button"
                        class="btn"
                        @click="goDelete(admin.MEMBER_ID)"
                      >
                        <img
                          src="../../assets/images/del_icon.svg"
                          alt="삭제"
                        />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent
              :totalCount="this.adminList.length"
              @paging-list="listPagingSet"
            />
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
      adminList: [],
      pageList: [],
      keyword: '',
      isLoding: false
    }
  },
  created () {
    this.goList()
  },
  mounted () {
    if (this.user.MEMBER_ID == undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    }
  },
  methods: {
    async goList () {
      try {
        this.isLoding = true
        this.adminList = await this.$api('/apirole/adminList', {
          param: this.keyword
        })
        console.log('this.adminList===' + this.adminList.length)
        this.isLoding = false
      } catch (e) {
        console.log('error==' + e)
      }
    },
    goUpdate (member_id) {
      this.$router.push({
        path: '/adminUpdate',
        query: { member_id: member_id }
      })
    },
    goRegist () {
      this.$router.push({ path: '/adminRegist' })
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
    goDelete (membber_id) {
      this.$swal
        .fire({
          title: '정말 삭제하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '삭제',
          cancelButtonText: '취소'
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            console.log(membber_id)
            await this.$api('/apirole/adminDelete', {
              param: [this.user.MEMBER_ID, membber_id]
            })
            this.goList()
            this.$swal.fire('삭제되었습니다!', '', 'success')
          }
        })
    },
    listPagingSet (data) {
      this.pageList = this.adminList.slice(data[0], data[1])
    }
  }
}
</script>
