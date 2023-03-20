<template lang="pug">
div.px-48px.pt-12px.pb-48px.h-full
  div.text-white.text-36px
    span Transactions
  div.bg-white.px-8px
    div.h-36px.lh-36px.flex A total of
      | {{ txs.length }}
      | transactions found
      block-change(:blockNumber="currentBlock", :routerAble="true", @changeBlockNumber="changeBlockNumber").ml-32px
    TransactionTable(:txs="txs", :block="block", scrollY="calc(100vh - 290px)", :loading="loading")
  
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BlockChange from '@/pages/explorer/components/block-change.vue'
import TransactionTable from '@/pages/explorer/components/transactions-table.vue'
const TBSApi = inject('TBSApi')
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const currentBlock = ref(1)
const txs = ref([])
const blockStart = ref(0)
const block = ref(null)

onMounted(async () => {
  if (route.query.block) {
    currentBlock.value = route.query.block - 0
  } else {
    blockStart.value = await TBSApi.getBlockNumber()
    currentBlock.value = blockStart.value
  }
  const b = await TBSApi.getBlockDetail(currentBlock.value)
  block.value = b
})

watchEffect(async () => {
  loading.value = true
  try {
    if (currentBlock.value) {
      txs.value = await TBSApi.getTransactionsByBlock(currentBlock.value)
    }
  } catch (e) {
  } finally {
    loading.value = false
  }
})

function changeBlockNumber(blockNumber) {
  router.push({
    name: route.name,
    query: {
      block: blockNumber,
    },
  })
}
</script>
