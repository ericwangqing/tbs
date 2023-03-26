<template lang="pug">
Nav
  router-view(:key="getRoute($route)")
</template>

<script>
import { defineComponent } from 'vue'
import Nav from '@/components/Nav.vue'

export default defineComponent({
  name: 'App',
  components: { Nav },
  setup: () => {
    const getRoute = (route) => {
      if (route.name === 'home') return 'network'
      if (route.name === 'security') return 'network'
      return route.fullPath
    }
    return {
      getRoute
    }
  }
})
</script>

<style>

@font-face {
  font-family: 'PangMenZhengDaoBiao';
  src: url('@/assets/PangMenZhengDaoBiao.ttf')
}
html,
body {
  overflow: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
