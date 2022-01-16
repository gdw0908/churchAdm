<template>
<router-view/>
</template>
<script>

export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
}
</script>