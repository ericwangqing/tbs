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

onMounted(async () => {})

const blockNumber = computed(() => {
  return route.query.block - 0
})

const transactions = computed(() => {
  return (block.value && block.value.transactions) || []
})

watchEffect(async () => {
  loading.value = true
  try {
    if (blockNumber) {
      block.value = await TBSApi.getBlockDetail(blockNumber.value, true)
    } else {
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
