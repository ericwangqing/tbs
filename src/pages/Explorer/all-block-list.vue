<template>
  <div class="px-48px pt-24px pb-48px h-100%">
    <div class="bg-white h-100% px-8px">
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
        :scroll="{ y: 'calc(100vh - 340px)' }"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'transactions'">
            <span>{{ record.transactions.length }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'gasUsed'">
            <span>{{ record.gasUsed.hex }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'gasLimit'">
            <span>{{ record.gasLimit.hex }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'baseFeePerGas'">
            <span>{{ record.baseFeePerGas.hex }}</span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect } from 'vue'
const TBSApi = inject('TBSApi')
const blocks = ref([])
const blockStart = ref(0)
const current = ref(1)
const pageSize = ref(20)
const loading = ref(false)

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
    DataIndex: 'Reward',
  },
  {
    title: 'Burnt Fees(ETH)',
    DataIndex: 'Burnt',
  },
]

function tableChange(page) {
  current.value = page.current
  pageSize.value = page.pageSize
}
</script>
