<template>
  <div>
    <SideMenu />
    <div class="main_container">
      <Header />
      <main class="main_wrap">
        <h2 class="table_tit">회원 관리</h2>

        <div class="container">
          <section class="top_box">
            <h3 class="top_tit">회원 목록</h3>

            <article class="search_wrap">
              <div class="search_box">
                <input
                  type="text"
                  class="form-control"
                  ref="keyword"
                  v-model="keyword"
                  placeholder="제목이나 내용을 검색해주세요."
                  @keyup.enter="goList"
                />
                <button class="search_btn" type="button" @click="goList">
                  <img src="../../assets/images/search_icon.svg" alt="검색" />
                </button>
              </div>
            </article>
          </section>

          <div class="table_container">
            <div class="table_wrap">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">ID</th>
                    <th scope="col">Writer</th>
                    <th scope="col">Church</th>
                    <th scope="col">Code Number</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Email</th>
                    <th scope="col">Birth</th>
                    <th scope="col">Date Joined</th>
                    <th scope="col" class="text-center">Edit</th>
                    <th scope="col" class="text-center" style="padding: 0;">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(user, i) in pageList">
                    <td scope="row">{{ user.ROWNUM }}</td>
                    <td>{{ user.MEMBER_ID }}</td>
                    <td class="w_12">{{ user.MEMBER_NM }}</td>
                    <td class="w_12">{{ user.CHURCH_NM }}</td>
                    <td class="w_15">{{ user.MEMBER_CODE }}</td>
                    <td class="w_12">{{ user.GENDER }}</td>
                    <td class="w_12">{{ user.CELL }}</td>
                    <td class="w_15">{{ user.EMAIL }}</td>
                    <td class="w_15">{{ user.BIRTH }}</td>
                    <td class="num w_20">{{ user.REG_DT }}</td>
                    <td class="text-center button">
                      <button type="button" class="btn">
                        <img
                          src="../../assets/images/edit_icon.svg"
                          alt="수정"
                          @click="goView(user.MEMBER_ID)"
                        />
                      </button>
                    </td>
                    <td class="text-center button">
                      <button
                        type="button"
                        class="btn"
                        @click="goDelete(user.MEMBER_ID)"
                      >
                        <img
                          src="../../assets/images/del_icon.svg"
                          alt="삭제"
                        />
                      </button>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent
              :totalCount="this.userList.length"
              @paging-list="listPagingSet"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu'
import Footer from '../../layouts/Footer'
import PageComponent from '../../components/Pagination'

export default {
  components: {
    Header,
    Footer,
    SideMenu,
    PageComponent,
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  data() {
    return {
      userList: [],
      pageList: [],
      keyword: '',
    }
  },
  mounted() {
    console.log('MEMBER_ID =>' + this.user.MEMBER_ID)
    if (this.user.MEMBER_ID) {
      console.log(this.$store.state.user)
    }
    if (this.user.MEMBER_ID == undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    }
  },
  created() {
    this.goList()
  },
  methods: {
    async goList() {
      try {
        this.userList = await this.$api('/apirole/memberList', {
          param: [this.keyword, this.user.CODE],
        })
        console.log('this.userList =>' + this.userList)
        console.log('this.keyword' + this.keyword)
      } catch (e) {
        this.$swal('로그인을 해야 이용할 수 있습니다.')
        this.$router.push({ path: '/adminLogin' })
      }
    },
    goUpdate(member_seq) {
      this.$router.push({
        path: '/adminUpdate',
        query: { member_seq: member_seq },
      })
      console.log('member_seq ==> ' + member_seq)
    },
    goView(member_id) {
      this.$router.push({
        path: '/userRtouch',
        query: { member_id: member_id },
      })
    },
    getGroupNm(value) {
      let groupNm = ''
      if (value == '1') {
        groupNm = '관리자'
      } else {
        groupNm = '일반'
      }
      return groupNm
    },
    goDelete(member_id) {
      this.$swal
        .fire({
          title: '정말 삭제하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: `삭제`,
          cancelButtonText: `취소`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$api('/apirole/memberDelete', {
              param: [this.user.MEMBER_ID, member_id],
            })
            this.goList()
            this.$swal.fire('삭제되었습니다!', '', 'success')
          }
        })
    },
    //페이징처리
    listPagingSet(data) {
      this.pageList = this.userList.slice(data[0], data[1])
    },
  },
}
</script>
