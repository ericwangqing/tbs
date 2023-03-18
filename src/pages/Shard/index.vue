<template lang="pug">
.shard
  span TBS-testbed shard chain list
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
name: 'Shard',
components: {},

setup: () => {
  return {}
},
})
</script>

<style scoped lang="scss">
.shard {
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