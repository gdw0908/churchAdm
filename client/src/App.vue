<template>
<router-view/>
</template>

<style scoped>
@import './css/reset.css';
@import './css/common.css';

</style>

<script>
import AOS from 'aos'

export default {
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false
    })
  }
}
</script>
