<template lang="pug">
.benchmark
  span TBS-testbed benchmark
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
name: 'Benchmark',
components: {},

setup: () => {
  return {}
},
})
</script>

<style scoped lang="scss">
.benchmark {
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