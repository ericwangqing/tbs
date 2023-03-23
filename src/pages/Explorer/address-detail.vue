<template lang="pug">
div.rounded-8px
  a-row(:gutter="12").mb-12px
    a-col(:span="12")
      a-card(:bodyStyle="{ padding: '0 32px' }")
        template(#title)
          div.font-bold Overview
        div
          description-item(label="balance")
            template(#label) balance:
            | {{ utils.formatUnits(balance) + 'Ether' }}
    a-col(:span="12")
      a-card(:bodyStyle="{ padding: '0 32px' }")
        template(#title)
          div.font-bold MoreInfo
        div
          description-item(label="balance")
            template(#label) My Name Tag:
  div.address-detail-container.px-8px.pb-30px
    a-tabs(v-model:activeKey="activeKey")
      a-tab-pane(key="transactions", tab="Transactions")
        TransactionsTable(:txs="txs", :loading="loading",:pagination="pagination")

</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { utils } from 'ethers'
import TransactionsTable from '@/pages/explorer/components/transactions-table.vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
const route = useRoute()
const TBSApi = inject('TBSApi')
const activeKey = ref('transactions')
const txs = ref([])
const loading = ref(false)
const balance = ref(0)
const address = computed(() => {
  return route.params.hash
})

const pagination = computed(() => ({
  // total: (block.value && block.value.transactions.length) || 0,
  // current: current.value,
  // pageSize: pageSize.value,
  position: ['bottomRight', 'topRight'],
  size: 'small',
}))

watchEffect(async () => {
  loading.value = true
  try {
    if (address.value) {
      balance.value = await TBSApi.getAccountBalance(address.value)
      txs.value = await TBSApi.getTransactionsByAddress({
        address: address.value,
        page: 1,
      })
    }
  } catch (e) {
  } finally {
    loading.value = false
  }
})
</script>
<style>
.address-detail-container {
  background: #3a3d4c;
}
</style>
