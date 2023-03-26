<template lang="pug">
div.block-detail-container.px-30px.pb-60px.rounded-8px
    a-tabs(class="dark-tabs",v-model:activeKey="activeKey")
      a-tab-pane(key="Overview", tab="Overview")
        a-skeleton(:loading="loading" active)
          BlockOverview(:block="block")
      a-tab-pane(key="ConsensusInfo", tab="Consensus Info")
        a-skeleton(:loading="loading" active)
          BlockConsensusInfo(:block="block")  
</template>
<script setup>
import { computed, ref, watchEffect, inject } from 'vue'
import { useRoute } from 'vue-router'
import BlockOverview from '@/pages/Explorer/components/block-overview.vue'
import BlockConsensusInfo from '@/pages/Explorer/components/block-consensus-info.vue'
const TBSApi = inject('TBSApi')
const route = useRoute()
const activeKey = ref('Overview')
const loading = ref(false)
const block = ref(null)
const blockNumber = computed(() => {
  return route.params.blockNumber - 0
})

const isHash = computed(() => {
  return route.params.blockNumber.startsWith('0x')
})

watchEffect(async () => {
  loading.value = true
  try {
    if (blockNumber.value) {
      const { blockReward } = await TBSApi.getBlockRward(blockNumber.value)
      const b = await TBSApi.getBlockDetail(blockNumber.value, true)
      b.reward = blockReward * Math.pow(10, -18)
      block.value = b
      console.log(block.value)
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
})
</script>
<style lang="scss">
.block-detail-container {
  background: #3a3d4c;
}
</style>
