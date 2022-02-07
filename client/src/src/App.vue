<template>
<router-view/>
</template>

<style scoped>
@import './css/reset.css';
@import './css/common.css';

</style>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
}
</script>