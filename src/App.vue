<template lang="pug">
Nav
  router-view
</template>

<script>
import { defineComponent } from 'vue'
import Nav from '@/components/Nav.vue'

export default defineComponent({
  name: 'App',
  components: { Nav }
})
</script>

<style>
html,
body {
  overflow-y: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
