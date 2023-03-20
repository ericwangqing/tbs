<template lang="pug">
div
  div A set of information that represents the current state is updated when a transaction takes place on the network. The below is a summary of those changes :
  a-table(:columns="columns", :pagination="false", rowKey="address", :dataSource="dataSource")
    template(#bodyCell="{ column, record, text }")
      template(v-if="column.dataIndex === 'address'")
        router-link(:to="`/explorer-address/${text}`").truncate.max-w-200px.inline-block {{ text }}

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
      address: props.transaction.to,
      before: '',
      after: '',
      difference: '',
    },
    {
      address: props.transaction.to,
    },
    {
      address: props.block.miner,
    },
  ]
})
</script>
