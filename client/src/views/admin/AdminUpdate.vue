<template>
<div>
  <Header />
  <main class="mt-3">
    <div class="container">
      <h2 class="text-center fs-3 fw-bold">관리자 수정</h2>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">아이디</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="text" class="form-control" ref="member_id" v-model="admin.MEMBER_ID" @keyup="beforeMemChk">
            <!-- <span class="input-group-text">중복체크</span> -->
            <button :class="['btn btn-info', isBeforeId ? 'disabled' : '']" type="button" @click="goDupleChk()">중복체크</button>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">이름</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="text" class="form-control" ref="member_nm" v-model="admin.MEMBER_NM">
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">패스워드</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="password" class="form-control" ref="member_pwInp" v-model="admin.member_pw" @keyup="this.member_pwchk=''">
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">패스워드확인</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="password" class="form-control" ref="member_pwchk" v-model="member_pwchk" @keyup="inputChkPwd()">
          </div>
          <span class="input-group-text text-info" v-show="isPwState1">패스워드가 일치 합니다.</span>
          <span class="input-group-text text-danger" v-show="isPwState2">패스워드가 불일치 합니다.</span>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">이메일</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="email" class="form-control" ref="email" v-model="admin.EMAIL">
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col-6 d-grid p-1">
          <button type="button" class="btn btn-lg btn-dark" @click="goToList">취소하기</button>
        </div>
        <div class="col-6 d-grid p-1">
          <button type="button" class="btn btn-lg btn-danger" @click="adminInsert">저장하기</button>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</div>
</template>
<script>
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
const bcrypt = require('bcryptjs');

export default {
  components: {Header, Footer},  
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      admin: {
        MEMBER_ID: "",
        MEMBER_NM: "",
        MEMBER_PW: "",
        GROUP_SEQ : '1',
        EMAIL: "" ,               
        MOD_ID: "" 
      },
      member_pwchk: "",
      isPwState1 : false,
      isPwState2 : false,
      idDupleChk : false,
      isPwChk : false,
      beforeMemId : "",
      isBeforeId : true
    };
  },
  created() {
    this.getAdminInfo();
  },
  mounted() {
    if(this.user.MEMBER_ID == undefined) {
      this.$swal("로그인을 해야 이용할 수 있습니다.");
      this.$router.push({path:'/adminLogin'}); 
    }else{
      this.admin.mod_id = this.user.MEMBER_ID;
    }
  },
  methods: {
    goToList(){
      this.$router.push({path:'/adminList'}); 
    },
    async getAdminInfo() {
      let adminInfo = await this.$api("/apirole/adminInfo",{param:[this.$route.query.member_id]});
      console.log("adminInfo[0]=="+adminInfo[0].MEMBER_ID);      
      if(adminInfo.length > 0) {
        this.beforeMemId = adminInfo[0].MEMBER_ID;
        this.idDupleChk = true;
        this.admin = adminInfo[0];
      }
    },
    async goDupleChk(){
      if(this.admin.MEMBER_ID == "") {
        return this.$swal("아이디는 필수 입력값입니다.");
      }
      try{
        let idChk = await this.$api("/apirole/idDupleChk",{param:[this.admin.MEMBER_ID] });
        //console.log("idChk==="+JSON.stringify(idChk));
        console.log("idChkCnt1==="+idChk[0].idCnt);
        if(idChk[0].idCnt > 0){
          this.$swal("이미 사용중인 아이디 입니다.",this.$refs.member_id.focus());  
          this.admin.MEMBER_ID ="";
          this.idDupleChk = false;
        }else{
          this.idDupleChk = true;
          this.$swal("사용할 수 있는 아이디 입니다.");
        }        
      }catch(e){
        console.log("error=="+e)
      }
    },
    inputChkPwd(){
      if(this.admin.member_pw == this.member_pwchk){
        this.isPwState1 = true;
        this.isPwState2 = false;
        this.isPwChk = true;
      }else{
        this.isPwState1 = false;
        this.isPwState2 = true;
        this.isPwChk = false;
      }
    },
    beforeMemChk() {
      if(this.admin.MEMBER_ID == this.beforeMemId){
        this.isBeforeId = true;
        this.idDupleChk = true;
      }else{
        this.isBeforeId = false;
        this.idDupleChk = false;
      }
    },
    adminInsert() {
      if(!this.admin.MEMBER_ID) {
        return this.$swal("아이디는 필수 입력값입니다.", this.$refs.member_id.focus());
      }
      if(!this.admin.MEMBER_NM) {
        return this.$swal("이름은 필수 입력값입니다.", this.$refs.member_nm.focus());
      }
      if(!this.admin.member_pw) {
        return this.$swal("비밀번호는 필수 입력값입니다.", this.$refs.member_pwInp.focus());
      }
      if(!this.member_pwchk) {
        return this.$swal("비밀번호 확인은 필수 입력값입니다.", this.$refs.member_pwchk.focus());
      }
      if (!this.admin.EMAIL) {
        return this.$swal("이메일은 필수 입력값입니다.", this.$refs.email.focus());
      } else if (!this.validEmail(this.admin.EMAIL)) {
        return this.$swal("올바른 이메일 형식이 아닙니다.", this.$refs.email.focus());
      }
      if(!this.idDupleChk){
        return this.$swal("아이디 중복체크를 실행해 주세요.", this.$refs.member_id.focus());
      }
      if(!this.isPwChk){
        return this.$swal("패스워드가 불일치 합니다.", this.$refs.member_pwchk.focus());
      }

      this.$swal.fire({
        title: '수정 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: `수정`,
        cancelButtonText: `취소`
      }).then(async (result) => {
        if(result.isConfirmed) {
          try{
            await this.$api("/apirole/adminUpdate",{param:[this.admin,this.admin.MEMBER_ID,this.beforeMemId]});
            this.$swal.fire('저장되었습니다!', '', 'success');
            this.$router.push({path:'/adminList'});
          }catch(e){
            console.log("error=="+e)
          }
        }         
      });
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }      
  }
}
</script>