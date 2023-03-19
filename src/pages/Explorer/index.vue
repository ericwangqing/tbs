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
          <template v-slot="{ item, lastItem }">
            <div class="flex px-12px">
              <div class="bk mr-8px">Bk</div>
              <div class="mr-8px" @click="gotoBlockDetail(item.number)">
                <router-link :to="`/explorer-block/${item.number}`">{{
                  item.number
                }}</router-link>
                <div>{{ fromNow(item.timestamp) }}</div>
              </div>
              <div>
                <div>
                  Fee Recipient
                  <router-link
                    :to="`/explorer-block/${item.number}`"
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
                      item.timestamp - (lastItem && lastItem.timestamp)
                    } secs`
                  }}
                </div>
              </div>
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
            <div class="flex px-12px">
              <div class="tx mr-8px">TX</div>
              <div class="mr-8px">
                <router-link
                  :to="`/explorer-transaction/${item.hash}`"
                  class="truncate max-w-200px inline-block h-16px"
                  >{{ item.hash }}</router-link
                >
                <div>{{ fromNow(transactionBlock.timestamp) }}</div>
              </div>
              <div>
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
import { useRouter } from 'vue-router'
import useTime from '@/hook/timeHook'
import { computed } from '@vue/reactivity'
const { fromNow } = useTime()
const TBSApi = inject('TBSApi')
const router = useRouter()
const loading = ref(false)
const blocks = ref([])

onMounted(async () => {
  try {
    loading.value = true
    const { blocks: bs } = await TBSApi.getBlockListWithTransactions()
    blocks.value = bs
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
<style lang="scss">
.ant-card-head {
  padding-left: 16px;
}
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
</style>
