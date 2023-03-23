<template lang="pug">
TransactionsTable(:txs="txs", :loading="loading",:pagination="pagination",@change='tableChange')
</template>
<script setup>
import { ref, computed, defineProps, watchEffect, inject } from 'vue'
import TransactionsTable from '@/pages/explorer/components/transactions-table.vue'
const txs = ref([])
const TBSApi = inject('TBSApi')
const loading = ref(false)
const props = defineProps(['address'])
const current = ref(1)
const pageSize = ref(10)
const transactionCount = ref(0)

const pagination = computed(() => ({
  total: transactionCount.value,
  current: current.value,
  pageSize: pageSize.value,
  position: ['bottomRight', 'topRight'],
  size: 'small',
}))

watchEffect(async () => {
  if (!props.address) {
    return
  }
  loading.value = true

  try {
    transactionCount.value = await TBSApi.getTransactionCount(props.address)
    txs.value = await TBSApi.getTransactionsByAddress({
      address: props.address,
      page: current.value,
      offset: pageSize.value,
    })
    console.log(txs.value)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
})

function tableChange(page) {
  current.value = page.current
  pageSize.value = page.pageSize
}
</script>
