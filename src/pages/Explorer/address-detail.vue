<template lang="pug">
div.rounded-8px
  a-row(:gutter="12").mb-12px
    a-col(:span="12")
      a-card(:bodyStyle="{ padding: '0 32px' }")
        template(#title)
          div.font-bold Overview
        div
          description-item.no-border(label="balance")
            template(#label) balance:
            | {{ utils.formatUnits(balance) + 'Ether' }}
    a-col(:span="12")
      a-card(:bodyStyle="{ padding: '0 32px' }")
        template(#title)
          div.font-bold MoreInfo
        div
          description-item.no-border(label="balance")
            template(#label) My Name Tag:
  div.address-detail-container.px-8px.pb-60px
    a-tabs(v-model:activeKey="activeKey")
      a-tab-pane(key="transactions", tab="Transactions")
        addressTransactions(:address="address")
</template>
<script setup>
import { inject, computed, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { utils } from 'ethers'
import AddressTransactions from './components/address-transactions.vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
const route = useRoute()

const loading = ref(false)
const activeKey = ref('transactions')

const balance = ref(0)
const address = computed(() => {
  return route.params.hash
})

watchEffect(async () => {
  loading.value = true
  try {
    if (address.value) {
      balance.value = await TBSApi.getAccountBalance(address.value)
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
