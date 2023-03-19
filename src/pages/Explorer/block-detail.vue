<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">
      <span>Block</span>
      <span class="text-white text-16px ml-8px" v-if="blockNumber">
        # {{ blockNumber }}
      </span>
    </div>
    <div class="bg-white px-8px">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="Overview" tab="Overview"
          ><BlockOverview :block="block"></BlockOverview
        ></a-tab-pane>
        <a-tab-pane key="ConsensusInfo" tab="Consensus Info"
          ><BlockConsensusInfo :block="block"></BlockConsensusInfo
        ></a-tab-pane>
      </a-tabs>
    </div>
  </div>
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

watchEffect(async () => {
  loading.value = true
  try {
    if (blockNumber) {
      block.value = await TBSApi.getBlockDetail(blockNumber.value, true)
      console.log(block.value)
    }
  } catch (e) {
  } finally {
    loading.value = false
  }
})
</script>
