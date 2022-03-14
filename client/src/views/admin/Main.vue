<template>
  <div>
    <SideMenu @closeMenu="toggle = true" />
    <div class="main_container">
      <Header />

      <main class="main_wrap main_grid">
        <section class="main_banner section">
          <article class="banner_txt_wrap">
            <h2 class="banner_tit">종합 헌금 관리</h2>
            <p class="sub_tit">날짜별 통계 확인 및 헌금을 종합적으로 관리하세요.</p>
            <div class="today_wrap">
              <span class="today">Today</span>
              <p>{{ today }}</p><span class="time">{{ time }}</span>
            </div>
          </article>
        </section>

        <!-- 오늘의 헌금 차트 -->
        <!-- 오늘 헌금 1~3위 표시 -->
        <section class="today_offering section top_move3">
          <h2 class="tit">오늘의 헌금</h2>
          <ul>
            <li>
              <div class="item_con">
                <span class="name">여의도순복음교회</span>
                <div>
                  <span class="price">+62,000,000</span>
                  <span class="time">20분전</span>
                </div>
              </div>
            </li>
            <li>
              <div class="item_con">
                <span class="name">여의도순복음교회</span>
                <div>
                  <span class="price">+62,000,000</span>
                  <span class="time">20분전</span>
                </div>
              </div>
            </li>
            <li>
              <div class="item_con">
                <span class="name">여의도순복음교회</span>
                <div>
                  <span class="price">+62,000,000</span>
                  <span class="time">20분전</span>
                </div>
              </div>
            </li>
            <li class="gradient"></li>
          </ul>
        </section>

        <section class="chart chart_month section top_move3">
          <article>
            <h2 class="tit">월별 헌금</h2>
            <select class="chart_select">
              <option v-for="(year, i) in year" :key="i" :value="i">{{ year }}</option>
            </select>
          </article>

          <article class="chart_container">
            <BarChart />
          </article>
        </section>

        <!-- 일별 헌금 차트 -->
        <section class="chart chart_day section top_move3">
          <article>
            <h2 class="tit">일별 헌금</h2>
            <div>
              <select class="chart_select">
                <option v-for="(year, i) in year" :key="i" :value="i">{{ year }}</option>
              </select>
              <span class="sl">/</span>
              <select class="chart_select">
                <option v-for="(month, i) in month" :key="i" :value="i">{{ month }}</option>
              </select>
            </div>
          </article>

          <article class="chart_container">
            <LineChart />
          </article>
        </section>

        <!-- 교회별 누적 헌금 금액 슈퍼관리자만 볼수 있는 컨텐츠 -->
        <section class="section accumulate" v-if="user.CODE == 1">
          <article class="top_wrap">
            <div class="total_wrap">
              <h2 class="tit">교회별 누적 헌금 금액</h2>
              <p class="total_price">400,000,000<span>￦</span></p>
            </div>
            <div class="search_wrap">
              <div class="search_box">
                <input type="text" class="form-control" ref="keyword" v-model="keyword" placeholder="검색어를 입력하세요.">
                <button class="search_btn" type="button">
                  <img src="../../assets/images/search_icon.svg" alt="검색">
                </button>
              </div>
            </div>
          </article>

          <div class="table_container">
            <div class="table_wrap">
              <table class="table table-hover acc_table">
                <thead>
                  <tr>
                    <th scope="col">NO.</th>
                    <th scope="col">Church</th>
                    <th scope="col">Code Number</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>여의도순복음교회</td>
                    <td>001</td> <!-- 교회코드 -->
                    <td>12,000,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent />
          </div>
        </section>

        <!-- 회원별 누적 헌금 금액 -->
        <section class="section accumulate">
          <article class="top_wrap">
            <div class="total_wrap">
              <h2 class="tit">회원별 누적 헌금 금액</h2>
            </div>
            <div class="search_wrap">
              <div class="search_box">
                <input type="text" class="form-control" ref="keyword" v-model="keyword" placeholder="검색어를 입력하세요.">
                <button class="search_btn" type="button">
                  <img src="../../assets/images/search_icon.svg" alt="검색">
                </button>
              </div>
            </div>
          </article>

          <div class="table_container">
            <div class="table_wrap">
              <table class="table table-hover acc_table2">
                <thead>
                  <tr>
                    <th scope="col">NO.</th>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Church</th>
                    <th scope="col">Code Number</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>admin</td>
                    <td>홍길동</td>
                    <td>여의도순복음교회</td>
                    <td>001</td> <!-- 교회코드 -->
                    <td>12,000,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent />
          </div>
        </section>
      </main>

      <!-- Back To Top -->
      <button class="top_btn" @click="backToTop" v-if="btnShow === true">
        <img src="../../assets/images/top_arrow.png" alt="위로">
      </button>

      <Footer />
    </div>
  </div>
</template>
<script>
import Header from '../../layouts/Header'
import SideMenu from '../../layouts/SideMenu'
import BarChart from '../../components/BarChart'
import LineChart from '../../components/LineChart'
import PageComponent from '../../components/Pagination'
import Footer from '../../layouts/Footer'

export default {
  name: 'main',
  components: {
    Header,
    SideMenu,
    BarChart,
    LineChart,
    PageComponent,
    Footer
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  data () {
    return {
      year: [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      month: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      keyword: '',
      keyword1: '',
      pageList: [],
      toggle: false,
      today: '',
      time: '',
      windowTop: 0,
      btnShow: false
    }
  },
  setup () {},
  created () {
    this.goList()
    this.getNow()
    setInterval(this.updateTime, 1000)
  },
  mounted () {
    if (this.user.MEMBER_ID == undefined) {
      this.$swal('로그인을 해야 이용할 수 있습니다.')
      this.$router.push({ path: '/adminLogin' })
    }

    window.addEventListener('scroll', this.onScroll)
  },

  beforeUnmount () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    async goList () {
      try {
        this.adminList = await this.$api('/apirole/adminList', {
          param: [
            this.keyword
          ]
        })
        console.log('this.adminList===' + this.adminList.length)
        // this.$refs.childComponent.paginatedData();
      } catch (e) {
        console.log('error==' + e)
      }
    },

    getNow () {
      const today = new Date()
      const date = today.getFullYear().toString().substr(-2) + '.' + ('0' + (today.getMonth() + 1)).slice(-2) + '.' + ('0' + today.getDate()).slice(-2)
      this.today = date
    },

    updateTime () {
      const date = new Date()
      const nowTime = (date.getHours()) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
      this.time = nowTime
    },

    onScroll (e) {
      // eslint-disable-next-line no-unused-vars
      const topBtn = document.querySelector('.top_btn')
      this.windowTop = e.target.documentElement.scrollTop
      if (this.windowTop > 500) {
        this.btnShow = true
      } else {
        this.btnShow = false
      }
    },

    backToTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>
<style scoped>
  @import '../../css/style.css';
</style>
