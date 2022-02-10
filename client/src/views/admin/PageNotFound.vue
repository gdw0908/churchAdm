<template>
  <div>
    <section class="error_container">
      <article class="left_wrap">
        <h1 class="tit_404">Oops!</h1>
        <p>
          페이지를 찾을 수 없습니다.<br>
          올바른 URL을 입력하셨는지 확인 부탁드립니다.
        </p>
        <div class="btn_wrap">
          <button type="button" @click="this.$router.push('/main');">홈으로</button>
          <button type="button" @click="this.$router.go(-1);">이전 페이지</button>
        </div>
      </article>
      <article class="right_wrap">
        <div class="img_box">
          <img src="../../assets/images/error_404_img.png" alt="404">
        </div>
      </article>
    </section>
  </div>
</template>
<script>
export default {
  name: 'pageNotFound',
  components: {},
  data() {
    return {

    };
  }, 
  setup() {}, 
  created() {},
  mounted() {},
  unmounted() {},
  methods: {}
}
</script>