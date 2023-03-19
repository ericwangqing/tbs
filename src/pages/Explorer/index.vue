<template>
  <div class="overflow-hidden px-48px pt-24px pb-48px h-100%">
    <a-row :gutter="16" class="h-100%">
      <a-col :span="12" class="h-100%">
        <card
          @viewMore="gotoAllBlockList"
          :datasource="blocks"
          headerTitle="Latest Blocks"
          footerTitle="View All Blocks"
          :loading="loading"
        >
          <template v-slot="{ item }">
            <div>{{ item.number }}</div>
          </template>
        </card>
      </a-col>
      <a-col :span="12" class="h-100%">
        <card
          @viewMore="gotoAllTransactionList"
          :datasource="transactions"
          headerTitle="Latest Transactions"
          footerTitle="View All Transactions"
          :loading="loading"
        >
          <template v-slot="{ item }">{{ item.hash }}</template>
        </card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import card from '@/pages/explorer/components/card.vue'
import { onMounted, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
const TBSApi = inject('TBSApi')
const router = useRouter()
const loading = ref(false)
const blocks = ref([])
const transactions = ref([])

onMounted(async () => {
  try {
    loading.value = true
    const { blocks: bs } = await TBSApi.getBlockListWithTransactions()
    blocks.value = bs
    transactions.value = bs[0].transactions
  } catch (e) {
  } finally {
    loading.value = false
  }
})

function gotoAllBlockList() {
  router.push({
    name: 'explorer-block-list',
  })
}

function gotoAllTransactionList() {
  router.push({
    name: 'explorer-transaction-list',
  })
}
</script>
