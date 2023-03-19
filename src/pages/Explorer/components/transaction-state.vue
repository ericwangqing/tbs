<template>
  <div>
    <div>
      A set of information that represents the current state is updated when a
      transaction takes place on the network. The below is a summary of those
      changes :
    </div>
    <a-table
      :columns="columns"
      :pagination="false"
      rowKey="address"
      :dataSource="props.txs"
    ></a-table>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps(['transaction', 'transactionReceipt', 'block'])
const columns = [
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Before',
    dataIndex: 'before',
  },
  {
    title: 'After',
    dataIndex: 'after',
  },
  {
    title: 'State Difference',
    dataIndex: 'difference',
  },
]

const dataSource = computed(() => {
  return [
    {
      address: '',
      before: '',
      after: '',
      difference: '',
    },
  ]
})
</script>
