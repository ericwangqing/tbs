<template lang="pug">
div.transaction-list-container.px-30px.pb-60px.rounded-8px
      div.h-64px.lh-64px.text-white.flex A total of 
        | {{ txs.length }}
        | transactions found
        block-change(:blockNumber="currentBlock", :routerAble="true", @changeBlockNumber="changeBlockNumber").ml-32px
      TransactionTable(:txs="txs", :block="block", :loading="loading",:pagination="pagination",@change='tableChange')
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BlockChange from '@/pages/Explorer/components/block-change.vue'
import TransactionTable from '@/pages/Explorer/components/transactions-table.vue'
const TBSApi = inject('TBSApi')
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const currentBlock = ref(1)
const txs = ref([])
const blockStart = ref(0)
const block = ref(null)
const current = ref(1)
const pageSize = ref(2)
const emit = defineEmits()

const pagination = computed(() => ({
  total: (block.value && block.value.transactions.length) || 0,
  current: current.value,
  pageSize: pageSize.value,
  position: ['bottomRight', 'topRight'],
  size: 'small',
  'show-quick-jumper': true
}))

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
    emit('finish')
  }
})

function tableChange(page) {
  current.value = page.current
  pageSize.value = page.pageSize
  emit('finish')
}

function changeBlockNumber(blockNumber) {
  router.push({
    name: route.name,
    query: {
      block: blockNumber,
    },
  })
}
</script>
<style scoped lang="scss">
.transaction-list-container {
  background: #3a3d4c;
}
</style>
