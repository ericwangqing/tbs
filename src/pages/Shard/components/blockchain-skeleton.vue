<template lang="pug">
.blockchain-skeleton-container
  Block(:block="{state: 'loading'}" key="0")
  .blockchain-linkline
  Block(:block="{state: 'loading'}" key="1")
  .blockchain-linkline
  Block(:block="{state: 'loading'}" key="2")
  .blockchain-linkline
  Block(:block="{state: 'loading'}" key="3")
  .blockchain-linkline
  Block(:block="{state: 'loading'}" key="4")
  .blockchain-linkline
</template>

<script>
import {defineComponent, reactive} from 'vue'
import Block from './block.vue'
import {random, range} from "lodash";
export default defineComponent({
  name: 'BlockchainSkeleton',
  components: {Block},
  setup: () => {
    const blockchain = reactive(range(5).map(() => {
      return { state: 'loading', $key: random(1000) }
    }))
    return {
      blockchain
    }
  }
})
</script>

<style scoped>
.blockchain-skeleton-container {
  width: 1100px;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.blockchain-linkline {
  height: 4px;
  width: 20px;
  opacity: 0.1;
  background: #ffffff;
}
</style>
