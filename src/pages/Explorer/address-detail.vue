<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">
      <span>address</span>
      <span class="text-white text-16px ml-8px"> {{ address }}</span>
    </div>
    <a-row :gutter="12" class="mb-12px">
      <a-col :span="12">
        <a-card :bodyStyle="{ padding: 0 }">
          <template #title><div class="font-bold">Overview</div></template>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :bodyStyle="{ padding: 0 }">
          <template #title><div class="font-bold">MoreInfo</div></template>
        </a-card>
      </a-col>
    </a-row>
    <a-card :bodyStyle="{ padding: 0 }">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="transactions" tab="Transactions">
          <TransactionsTable :txs="txs"></TransactionsTable>
        </a-tab-pane>
        <a-tab-pane key="erc20Txns" tab="Erc20 Token Txns"> </a-tab-pane>
        <a-tab-pane key="erc721Txns" tab="Erc721 Token Txns"> </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import TransactionsTable from '@/pages/explorer/components/transactions-table.vue'
const route = useRoute()
const activeKey = ref('transactions')
const txs = ref([])
const address = computed(() => {
  return route.params.hash
})
</script>
