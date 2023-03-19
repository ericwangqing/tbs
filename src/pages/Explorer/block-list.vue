<template>
  <div class="px-48px pt-12px pb-48px h-100%">
    <div class="text-white text-36px">Blocks</div>
    <div class="bg-white px-8px">
      <div class="h-36px lh-36px">
        {{
          `Block #${fromBlockNumber} to #${toBlockNumber}(Total of ${
            blockStart + 1
          } blocks)`
        }}
      </div>
      <a-table
        :dataSource="blocks"
        :columns="columns"
        rowKey="number"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ y: 'calc(100vh - 350px)' }"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, text, index }">
          <template v-if="column.dataIndex === 'number'">
            <router-link :to="`/explorer-block/${record.number}`">{{
              text
            }}</router-link>
          </template>
          <template v-if="column.dataIndex === 'timestamp'">
            <span>{{ fromNow(text) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'transactions'">
            <router-link
              :to="`/explorer-transaction-list?block=${record.number}`"
              >{{ text.length }}</router-link
            >
          </template>
          <template v-else-if="column.dataIndex === 'miner'">
            <router-link :to="`/explorer-address/${record.miner}`">{{
              text
            }}</router-link>
          </template>
          <template v-else-if="column.dataIndex === 'gasUsed'">
            <div>
              <div>
                <span>{{ BigNumber.from(record.gasUsed.hex).toString() }}</span>
                <span>({{ calcGasUsePecent(record) }}%)</span>
              </div>
              <a-progress
                :strokeWidth="2"
                :showInfo="false"
                :percent="calcGasUsePecent(record)"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'gasLimit'">
            <span>{{ BigNumber.from(record.gasLimit.hex).toString() }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'baseFeePerGas'">
            <span>{{
              Number(
                utils.formatUnits(
                  BigNumber.from(record.baseFeePerGas.hex).mul(
                    BigNumber.from(record.gasUsed.hex)
                  ),
                  'gwei'
                )
              ).toFixed(2) + 'Gwei'
            }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'Reward'"> 待定 </template>
          <template v-else-if="column.dataIndex === 'Burnt'"> 待定 </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
import useTime from '@/hook/timeHook'
import { BigNumber, utils } from 'ethers'
const TBSApi = inject('TBSApi')
const blocks = ref([])
const blockStart = ref(0)
const current = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const { fromNow } = useTime()

onMounted(async () => {})

const pagination = computed(() => ({
  total: blockStart.value,
  current: current.value,
  pageSize: pageSize.value,
}))

const toBlockNumber = computed(() => {
  return blockStart.value - pageSize.value * (current.value - 1)
})

const fromBlockNumber = computed(() => {
  return toBlockNumber.value - pageSize.value
})

watchEffect(async () => {
  loading.value = true
  try {
    const { blocks: bs, start } = await TBSApi.getBlockList(
      pageSize.value * (current.value - 1),
      pageSize.value
    )
    blocks.value = bs
    blockStart.value = start
    console.log(blocks)
  } catch (e) {
  } finally {
    loading.value = false
  }
})

const columns = [
  {
    title: 'Block',
    dataIndex: 'number',
  },
  {
    title: 'Age',
    dataIndex: 'timestamp',
  },
  {
    title: 'Txn',
    dataIndex: 'transactions',
  },
  {
    title: 'Fee Recipient',
    dataIndex: 'miner',
  },
  {
    title: 'Gas Used',
    dataIndex: 'gasUsed',
  },
  {
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
  },
  {
    title: 'Base Fee',
    dataIndex: 'baseFeePerGas',
  },
  {
    title: 'Reward',
    dataIndex: 'Reward',
  },
  {
    title: 'Burnt Fees(ETH)',
    dataIndex: 'Burnt',
  },
]

function tableChange(page) {
  current.value = page.current
  pageSize.value = page.pageSize
}

function calcGasUsePecent({ gasUsed, gasLimit }) {
  return (
    BigNumber.from(gasUsed.hex)
      .mul(10000)
      .div(BigNumber.from(gasLimit.hex))
      .toNumber() / 100
  )
}
</script>
