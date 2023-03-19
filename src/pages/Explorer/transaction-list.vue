<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">
      <span>Transactions</span>
      <span class="text-white text-16px ml-8px" v-if="blockNumber">
        For Block
        <router-link :to="`/explorer-block/${blockNumber}`">{{
          blockNumber
        }}</router-link>
      </span>
    </div>
    <div class="bg-white px-8px">
      <div v-if="blockNumber" class="h-36px lh-36px">
        A total of {{ transactions.length }} transactions found
      </div>
      <a-table
        :dataSource="transactions"
        :columns="columns"
        rowKey="hash"
        :loading="loading"
        :scroll="{ y: 'calc(100vh - 340px)' }"
      >
        <template #bodyCell="{ column, record }"> </template>
      </a-table>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const TBSApi = inject('TBSApi')
const route = useRoute()
const loading = ref(false)
const block = ref(null)
const current = ref(1)
const pageSize = ref(2)
const txs = ref([])

onMounted(async () => {})

const blockNumber = computed(() => {
  return route.query.block - 0
})

const transactions = computed(() => {
  if (blockNumber.value) {
    return (block.value && block.value.transactions) || []
  } else {
    return txs.value
  }
})

watchEffect(async () => {
  loading.value = true
  try {
    if (blockNumber.value) {
      block.value = await TBSApi.getBlockDetail(blockNumber.value, true)
    } else {
      const blockNumber = await TBSApi.getBlockNumber()
      txs.value = await TBSApi.getTransactionsByBlock(
        blockNumber - current.value + 1
      )
    }
  } catch (e) {
  } finally {
    loading.value = false
  }
})

const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'hash',
  },
  {
    title: 'Method',
    dataIndex: 'blockNumber',
  },
  {
    title: 'Block',
    dataIndex: 'blockNumber',
  },
  {
    title: 'Age',
    dataIndex: 'miner',
  },
  {
    title: 'From',
    dataIndex: 'from',
  },
  {
    title: 'To',
    dataIndex: 'to',
  },
  {
    title: 'Value',
    dataIndex: 'baseFeePerGas',
  },
  {
    title: 'Txn Fee',
    dataIndex: 'Reward',
  },
]
</script>
