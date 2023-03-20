<template lang="pug">
div.px-48px.pt-12px.pb-48px.h-full.flex.flex-col.overflow-hidden
  div.text-white.text-36px
    span Transaction Details
  div.bg-white.px-8px.pb-8px.h-0.flex-1
    a-tabs(v-model:activeKey="activeKey")
      a-tab-pane(key="Overview", tab="Overview")
        a-skeleton(:loading="loading")
          TransactionOverview(:transaction="transaction", :block="block", :transactionReceipt="transactionReceipt", :blockStart="blockStart")
  
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
const blockStart = ref(0)

const transactionHash = computed(() => {
  return route.params.hash
})

watchEffect(async () => {
  loading.value = true
  try {
    transaction.value = await TBSApi.getTransaction(transactionHash.value)
    transactionReceipt.value = await TBSApi.getTransactionReceipt(
      transactionHash.value
    )
    block.value = await TBSApi.getBlockDetail(transaction.value.blockNumber)
    blockStart.value = await TBSApi.getBlockNumber()
    console.log(transaction.value, transactionReceipt.value, block.value)
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
