<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">
      <span>Transactions</span>
    </div>
    <div class="bg-white px-8px">
      <div class="h-36px lh-36px flex">
        A total of {{ txs.length }} transactions found<block-change
          class="ml-32px"
          :blockNumber="currentBlock"
          :routerAble="true"
          @changeBlockNumber="changeBlockNumber"
        ></block-change>
      </div>
      <TransactionTable
        :txs="txs"
        scrollY="calc(100vh - 290px)"
        :loading="loading"
      ></TransactionTable>
    </div>
  </div>
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

onMounted(async () => {
  blockStart.value = await TBSApi.getBlockNumber()
  currentBlock.value = route.query.block
    ? route.query.block - 0
    : blockStart.value
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
