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
                <input type="text" class="form-control" ref="keyword" v-model="keyword" placeholder="검색어를 입력하세요." @keyup.enter="goList">
                <button class="search_btn" type="button" @click="goList">
                  <img src="../../assets/images/search_icon.svg" alt="검색">
                </button>
              </div>
              
              <button type="button" class="write_btn" @click="goRegist()">
                + 교회추가
              </button>
            </article> 
          </section>
    
          <div class="table_container">
            <div class="table_wrap">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">NO.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Code Number</th>
                    <th scope="col">Id</th>
                    <!-- <th scope="col">Writer</th> -->
                    <th scope="col">Manager</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Location</th>
                    <!-- <th scope="col">Emaile</th> -->
                    <th scope="col">Total Amount of Donation</th>
                    <th scope="col">Date</th>
                    <th scope="col" class="text-center">Edit</th>
                    <th scope="col" class="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(admin,i) in pageList">
                    <td>{{admin.ROWNUM}}</td>
                    <td>교회이름</td>
                    <td>교회코드번호</td>
                    <td>{{admin.MEMBER_ID}}</td>
                    <td>{{admin.MEMBER_NM}}</td>
                    <td>010-1111-1111</td>
                    <td>지역명</td>
                    <!-- <td>{{getGroupNm(admin.GROUP_SEQ)}}</td> -->
                    <!-- <td>{{admin.EMAIL}}</td> -->
                    <td class="num w_20">{{admin.REG_DT}}</td>
                    <td>100,000,000</td>
                    <td class="text-center button">
                      <button type="button" class="btn" @click="goUpdate(admin.MEMBER_ID);">
                        <img src="../../assets/images/edit_icon.svg" alt="수정">
                      </button>
                    </td>
                    <td class="text-center button">
                      <button type="button" class="btn" @click="goDelete(admin.MEMBER_ID);">
                        <img src="../../assets/images/del_icon.svg" alt="삭제">
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <PageComponent :totalCount="this.adminList.length" @paging-list="listPagingSet"/>
            <!-- <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class="btn btn-outline-secondary" type="button" @click="goRegist()">등록</button>
            </div> -->
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
import PageComponent from '../../components/Pagination'
import Footer from '../../layouts/Footer' 

export default {
  components: {
    Header, 
    SideMenu, 
    PageComponent,
    Footer
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      adminList: [],
      pageList: [],
      keyword : ''
    };
  },
  created() {
    this.goList(); 
  },
  mounted() {
    // if(this.user.MEMBER_ID == undefined) {
    //   this.$swal("로그인을 해야 이용할 수 있습니다.");
    //   this.$router.push({path:'/adminLogin'}); 
    // }
  },
  methods: {
    async goList() {
      try{
        this.adminList = await this.$api("/apirole/adminList",{param:this.keyword});
        console.log("this.adminList==="+this.adminList.length);
        //this.$refs.childComponent.paginatedData();
      }catch(e){
        console.log("error=="+e)
      }            
    },
    goUpdate(member_id) {
      this.$router.push({path:'/adminUpdate', query:{member_id:member_id}}); 
    },
    goRegist() {
      this.$router.push({path:'/adminRegist'}); 
    },
    getGroupNm(value) {
      let groupNm ="";
      if(value=="1"){
        groupNm = "관리자";
      }else{
        groupNm = "일반";
      }
      return groupNm;
    },
    goDelete(membber_id) {
      this.$swal.fire({
        title: '정말 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: `삭제`,
        cancelButtonText: `취소`
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log(membber_id)
          await this.$api("/apirole/adminDelete",{param:[this.user.MEMBER_ID,membber_id]});
          this.goList();
          this.$swal.fire('삭제되었습니다!', '', 'success')
        } 
      });
    },
    listPagingSet(data){
      this.pageList = this.adminList.slice(data[0], data[1]);
      //console.log("this.adminList lenth=="+this.adminList.length);
    }
  }

}
</script>