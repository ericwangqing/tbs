<template lang="pug">
.explorer
  span TBS-testbed block explorer
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
name: 'Explorer',
components: {},

setup: () => {
  return {}
},
})
</script>

<style scoped lang="scss">
.explorer {
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