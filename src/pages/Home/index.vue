<template lang="pug">
.home
  span TBS-testbed homepage
  AButton Start up
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
name: 'Home',
components: {},

setup: () => {
  return {}
},
})
</script>

<style scoped lang="scss">
.home {
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
  .ant-btn {
    margin-top: 36px;
  }
}
</style>