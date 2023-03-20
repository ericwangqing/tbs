<template lang="pug">
a-table(:dataSource="props.txs", :pagination="false", :columns="columns", rowKey="hash", :loading="props.loading", :scroll="{ y: props.scrollY }")
  template(#bodyCell="{ column, record, text }")
    template(v-if="column.dataIndex === 'hash'")
      router-link(:to="`/explorer-transaction/${text}`").truncate.max-w-200px.inline-block {{ text }}
    template(v-if="column.dataIndex === 'blockNumber'")
      router-link(:to="`/explorer-block/${text}`") {{ text }}
    template(v-if="column.dataIndex === 'from' || column.dataIndex === 'to'")
      router-link(:to="`/explorer-address/${text}`").truncate.max-w-200px.inline-block {{ text }}
    template(v-if="column.dataIndex === 'age'")
      | {{
      | fromNow((props.block && props.block.timestamp) || record.timeStamp)
      | }}
    template(v-if="column.dataIndex === 'value'") {{ utils.formatUnits(text.toString()) + ' Ether' }}
  
</template>
<script setup>
import useTime from '@/hook/timeHook'
import useTransaction from '@/hook/transactionHook'
import { BigNumber, utils } from 'ethers'
const { getFee } = useTransaction()
const { fromNow } = useTime()
const props = defineProps(['txs', 'block', 'loading', 'scrollY'])
const columns = [
  {
    title: 'Txn Hash',
    dataIndex: 'hash',
  },
  // {
  //   title: 'Method',
  //   dataIndex: 'method',
  // },
  {
    title: 'Block',
    dataIndex: 'blockNumber',
  },
  {
    title: 'Age',
    dataIndex: 'age',
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
]
</script>
