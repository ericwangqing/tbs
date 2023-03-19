<template>
  <a-table
    :dataSource="props.txs"
    :pagination="false"
    :columns="columns"
    rowKey="hash"
    :loading="props.loading"
    :scroll="{ y: props.scrollY }"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.dataIndex === 'hash'">
        <router-link :to="`/explorer-transaction/${text}`">{{
          text
        }}</router-link>
      </template>
      <template v-if="column.dataIndex === 'blockNumber'">
        <router-link :to="`/explorer-block/${text}`">{{ text }}</router-link>
      </template>
      <template v-if="column.dataIndex === 'from' || column.dataIndex === 'to'">
        <router-link :to="`/explorer-address/${text}`">{{ text }}</router-link>
      </template>
      <template v-if="column.dataIndex === 'value'">
        {{ utils.formatUnits(text.toString()) + ' Ether' }}
      </template>
      <template v-if="column.dataIndex === 'fee'"> 待实现 </template>
    </template>
  </a-table>
</template>
<script setup>
import { BigNumber, utils } from 'ethers'
const props = defineProps(['txs', 'loading', 'scrollY'])
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'hash',
  },
  {
    title: 'Method',
    dataIndex: 'method',
  },
  {
    title: 'Block',
    dataIndex: 'blockNumber',
  },
  {
    title: 'From',
    dataIndex: 'from',
  },
  {
    title: 'To',
    dataIndex: 'to',
  },
  {
    title: 'Value',
    dataIndex: 'value',
  },
  {
    title: 'Txn Fee',
    dataIndex: 'fee',
  },
]
</script>
