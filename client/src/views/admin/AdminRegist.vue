<template>
<div>
  <Header />
  <main class="mt-3">
    <div class="container">
      <h2 class="text-center fs-3 fw-bold">관리자 등록</h2>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">아이디</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="text" class="form-control" ref="member_id" v-model="admin.member_id" @keyup="this.idDupleChk=false">
            <!-- <span class="input-group-text">중복체크</span> -->
            <button class="btn btn-info" type="button" @click="goDupleChk()">중복체크</button>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">이름</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="text" class="form-control" ref="member_nm" v-model="admin.member_nm">
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
          <span class="input-group-text text-info" ref="pwdChkSpan1" v-show="isPwState1">패스워드가 일치 합니다.</span>
          <span class="input-group-text text-danger" ref="pwdChkSpan2" v-show="isPwState2">패스워드가 불일치 합니다.</span>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">이메일</label>
        <div class="col-md-5">
          <div class="input-group mb-3">
            <input type="email" class="form-control" ref="email" v-model="admin.email">
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
        member_id: "",
        member_nm: "",
        member_pw: "",
        group_seq : '1',
        email: "" ,               
        reg_id: "" 
      },
      member_pwchk: "",
      isPwState1 : false,
      isPwState2 : false,
      idDupleChk : false,
      isPwChk : false
    };
  },
  created() {
    //this.getCategoryList();
  },
  mounted() {
    if(this.user.MEMBER_ID == undefined) {
      this.$swal("로그인을 해야 이용할 수 있습니다.");
      this.$router.push({path:'/adminLogin'}); 
    }else{
      this.admin.reg_id = this.user.MEMBER_ID;
    }
  },
  methods: {
    goToList(){
      this.$router.push({path:'/adminList'}); 
    },
    async goDupleChk(){
      if(this.admin.member_id == "") {
        return this.$swal("아이디는 필수 입력값입니다.");
      }
      try{
        let idChk = await this.$api("/apirole/idDupleChk",{param:[this.admin.member_id] });
        //console.log("idChk==="+JSON.stringify(idChk));
        console.log("idChkCnt1==="+idChk[0].idCnt);
        if(idChk[0].idCnt > 0){
          this.$swal("이미 사용중인 아이디 입니다.",this.$refs.member_id.focus());  
          this.admin.member_id ="";
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
    adminInsert() {
      if(!this.admin.member_id) {
        return this.$swal("아이디는 필수 입력값입니다.", this.$refs.member_id.focus());
      }
      if(!this.admin.member_nm) {
        return this.$swal("이름은 필수 입력값입니다.", this.$refs.member_nm.focus());
      }
      if(!this.admin.member_pw) {
        return this.$swal("비밀번호는 필수 입력값입니다.", this.$refs.member_pwInp.focus());
      }
      if(!this.member_pwchk) {
        return this.$swal("비밀번호 확인은 필수 입력값입니다.", this.$refs.member_pwchk.focus());
      }
      if (!this.admin.email) {
        return this.$swal("이메일은 필수 입력값입니다.", this.$refs.email.focus());
      } else if (!this.validEmail(this.admin.email)) {
        return this.$swal("올바른 이메일 형식이 아닙니다.", this.$refs.email.focus());
      }
      if(!this.idDupleChk){
        return this.$swal("아이디 중복체크를 실행해 주세요.", this.$refs.member_id.focus());
      }
      if(!this.isPwChk){
        return this.$swal("패스워드가 불일치 합니다.", this.$refs.member_pwchk.focus());
      }
  
      this.$swal.fire({
        title: '정말 등록 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: `생성`,
        cancelButtonText: `취소`
      }).then(async (result) => {
        if(result.isConfirmed) {
          try{
            await this.$api("/apirole/adminInsert",{param:[this.admin]});
            this.$swal.fire('저장되었습니다!', '', 'success');
            this.$router.push({path:'/adminList'});
          }catch(e){
            console.log("error=="+e)
            return this.$swal("처리 중 오류가 발생했습니다.");
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