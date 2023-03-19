<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">
      <span>Transaction Details</span>
    </div>
    <div class="bg-white px-8px">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="Overview" tab="Overview"></a-tab-pane>
        <a-tab-pane key="InternalTxns" tab="Internal Txns"></a-tab-pane>
        <a-tab-pane key="Logs" tab="Logs"></a-tab-pane>
        <a-tab-pane key="State" tab="State"></a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watchEffect, inject } from 'vue'
import { useRoute } from 'vue-router'
const TBSApi = inject('TBSApi')
const route = useRoute()
const activeKey = ref('Overview')
const loading = ref(false)
const transaction = ref(null)
const transactionHash = computed(() => {
  return route.params.hash
})

watchEffect(async () => {
  loading.value = true
  try {
    if (blockNumber) {
      transaction.value = await TBSApi.getTransaction(transactionHash)
    }
  } catch (e) {
  } finally {
    loading.value = false
  }
})
</script>
