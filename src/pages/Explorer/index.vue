<template lang="pug">
div.overflow-hidden.px-48px.pt-24px.pb-48px.h-full
  a-row(:gutter="16").h-full
    a-col(:span="12").h-full
      card(@viewMore="gotoAllBlockList", :datasource="blocks", headerTitle="Latest Blocks", footerTitle="View All Blocks", :loading="loading")
        template(v-slot="{ item }")
          div.flex.px-12px.justify-between.w-full
            div.flex.w-200px
              div.bk.mr-8px Bk
              div
                router-link(:to="`/explorer-block/${item.number}`")
                  | {{
                  | item.number
                  | }}
                div {{ fromNow(item.timestamp) }}
            div.w-400px
              div Fee Recipient 
                router-link(:to="`/explorer-address/${item.miner}`").truncate.max-w-200px.inline-block.h-16px {{ item.miner }}
              div
                a-tooltip
                  router-link(:to="`/explorer-transaction-list?block=${item.number}`") {{ item.transactions.length + ' txns ' }}
                  template(#title) Transactions in this Block
                | {{
                | `in ${item.timestamp -(nextPageBlock && nextPageBlock.timestamp)} secs`
                | }}
            div
              a-tooltip Reward计算方式待研究
                template(#title) Block Reward
    a-col(:span="12").h-full
      card(@viewMore="gotoAllTransactionList", :datasource="transactions", headerTitle="Latest Transactions", footerTitle="View All Transactions", :loading="loading")
        template(v-slot="{ item }")
          div.flex.w-full.px-12px.justify-between
            div.flex
              div.tx.mr-8px TX
              div
                router-link(:to="`/explorer-transaction/${item.hash}`").truncate.max-w-200px.inline-block.h-16px {{ item.hash }}
                div {{ fromNow(transactionBlock.timestamp) }}
            div.w-400px
              div From 
                router-link(:to="`/explorer-address/${item.from}`").truncate.max-w-200px.inline-block.h-16px {{ item.from }}
              div To 
                router-link(:to="`/explorer-address/${item.to}`").truncate.max-w-200px.inline-block.h-16px {{ item.to }}
            div
              a-tooltip
                template(#title) Amount
                | {{
                | Number(utils.formatUnits(BigNumber.from(item.value).toString())).toFixed(4) + ' ETH'
                | }}
</template>
<script setup>
import card from '@/pages/explorer/components/card.vue'
import { onMounted, ref, inject } from 'vue'
import { BigNumber, utils } from 'ethers'
import { useRouter } from 'vue-router'
import useTime from '@/hook/timeHook'
import { computed } from '@vue/reactivity'
const { fromNow } = useTime()
const TBSApi = inject('TBSApi')
const router = useRouter()
const loading = ref(false)
const blocks = ref([])
const nextPageBlock = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const { blocks: bs, nextBlock } = await TBSApi.getBlockListWithTransactions(
      0,
      2
    )
    blocks.value = bs
    nextPageBlock.value = nextBlock
  } catch (e) {
  } finally {
    loading.value = false
  }
})

const transactions = computed(() => {
  return (blocks.value[0] && blocks.value[0].transactions) || []
})

const transactionBlock = computed(() => {
  return blocks.value[0]
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
<style lang="scss" scoped>
.bk,
.tx {
  width: 45px;
  height: 45px;
  text-align: center;
  line-height: 45px;
  border-radius: 8px;
  background-color: rgba(119, 131, 143, 0.1);
}

.tx {
  border-radius: 100%;
}

.eth-container {
  position: relative;
  color: #77838f;
  background-color: rgba(119, 131, 143, 0.1);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    content: '';
    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
    border-left: 0.7rem solid #fff;
  }
}
</style>
