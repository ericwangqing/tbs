
<template lang="pug">
.blockchain-skeleton-container
  Block(:block="{state: 'loading'}" key="0")
  Block(:block="{state: 'loading'}" key="1")
  Block(:block="{state: 'loading'}" key="2")
  Block(:block="{state: 'loading'}" key="3")
  Block(:block="{state: 'loading'}" key="4")
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
  width: 1080px;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
