<template lang="pug">
.security
  span TBS-testbed security
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
name: 'Security',
components: {},

setup: () => {
  return {}
},
})
</script>

<style scoped lang="scss">
.security {
  height: 100%;
  width: 100%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  span {
    font-size: 36px;
    margin-top: -60px;
  }
}
</style>