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
            <div class="flex px-12px justify-between w-100%">
              <div class="flex w-200px">
                <div class="bk mr-8px">Bk</div>
                <div @click="gotoBlockDetail(item.number)">
                  <router-link :to="`/explorer-block/${item.number}`">{{
                    item.number
                  }}</router-link>
                  <div>{{ fromNow(item.timestamp) }}</div>
                </div>
              </div>

              <div class="w-400px">
                <div>
                  Fee Recipient
                  <router-link
                    :to="`/explorer-address/${item.miner}`"
                    class="truncate max-w-200px inline-block h-16px"
                    >{{ item.miner }}</router-link
                  >
                </div>
                <div>
                  <router-link
                    :to="`/explorer-transaction-list?block=${item.number}`"
                    >{{ item.transactions.length + ' txns ' }}</router-link
                  >{{
                    `in ${
                      item.timestamp -
                      (nextPageBlock && nextPageBlock.timestamp)
                    } secs`
                  }}
                </div>
              </div>
              <div>Reward待计算</div>
            </div>
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
          <template v-slot="{ item }">
            <div class="flex w-100% px-12px justify-between">
              <div class="flex">
                <div class="tx mr-8px">TX</div>
                <div>
                  <router-link
                    :to="`/explorer-transaction/${item.hash}`"
                    class="truncate max-w-200px inline-block h-16px"
                    >{{ item.hash }}</router-link
                  >
                  <div>{{ fromNow(transactionBlock.timestamp) }}</div>
                </div>
              </div>

              <div class="w-400px">
                <div>
                  From
                  <router-link
                    class="truncate max-w-200px inline-block h-16px"
                    :to="`/explorer-address/${item.from}`"
                    >{{ item.from }}</router-link
                  >
                </div>
                <div>
                  To
                  <router-link
                    class="truncate max-w-200px inline-block h-16px"
                    :to="`/explorer-address/${item.to}`"
                    >{{ item.to }}</router-link
                  >
                </div>
              </div>
              <div>
                {{
                  Number(
                    utils.formatUnits(BigNumber.from(item.value).toString())
                  ).toFixed(4) + 'ETH'
                }}
              </div>
            </div>
          </template>
        </card>
      </a-col>
    </a-row>
  </div>
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
    nextPageBlock = nextBlock
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

function gotoBlockDetail() {}
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
