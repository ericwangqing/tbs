<template lang="pug">
div.px-48px.pt-12px.pb-48px.h-full.flex.flex-col.overflow-hidden
  div.text-white.text-36px
    span Block
    span(v-if="blockNumber").text-white.text-16px.ml-8px #
      | {{ blockNumber }}
  div.bg-white.px-8px.h-0.flex-1
    a-tabs(v-model:activeKey="activeKey")
      a-tab-pane(key="Overview", tab="Overview")
        a-skeleton(:loading="loading")
          BlockOverview(:block="block")
      a-tab-pane(key="ConsensusInfo", tab="Consensus Info")
        a-skeleton(:loading="loading")
          BlockConsensusInfo(:block="block")  
</template>
<script setup>
import { computed, ref, watchEffect, inject } from 'vue'
import { useRoute } from 'vue-router'
import BlockOverview from '@/pages/explorer/components/block-overview.vue'
import BlockConsensusInfo from '@/pages/explorer/components/block-consensus-info.vue'
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
.ant-tabs {
  height: 100%;
  .ant-tabs-content-holder {
    overflow-y: auto;
  }
}
</style>
