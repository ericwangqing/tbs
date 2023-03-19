<template>
  <div class="px-48px pt-12px pb-48px h-100% flex flex-col overflow-hidden">
    <div class="text-white text-36px">
      <span>Transaction Details</span>
    </div>
    <div class="bg-white px-8px h-0 flex-1">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="Overview" tab="Overview">
          <TransactionOverview
            :transaction="transaction"
            :block="block"
            :transactionReceipt="transactionReceipt"
          ></TransactionOverview>
        </a-tab-pane>
        <a-tab-pane key="State" tab="State">
          <TransactionState
            :transaction="transaction"
            :block="block"
            :transactionReceipt="transactionReceipt"
          ></TransactionState>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watchEffect, inject } from 'vue'
import { useRoute } from 'vue-router'
import TransactionOverview from '@/pages/explorer/components/transaction-overview.vue'
import TransactionState from '@/pages/explorer/components/transaction-state.vue'
const TBSApi = inject('TBSApi')
const route = useRoute()
const activeKey = ref('Overview')
const loading = ref(false)
const block = ref(null)
const transaction = ref(null)
const transactionReceipt = ref(null)
const transactionHash = computed(() => {
  return route.params.hash
})

watchEffect(async () => {
  loading.value = true
  try {
    if (transactionHash.value) {
      console.log('-------------')
      transaction.value = await TBSApi.getTransaction(transactionHash.value)
      transactionReceipt.value = await TBSApi.getTransactionReceipt(
        transactionHash.value
      )
      const b = await TBSApi.getBlockDetail(transaction.value.blockNumber)
      block.value = b
      console.log(transaction.value, transactionReceipt.value, block.value)
    }
  } catch (e) {
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
