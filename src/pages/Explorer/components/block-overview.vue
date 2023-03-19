<template>
  <div v-if="props.block">
    <div>
      <description-item
        v-for="description of descriptions"
        :key="description.label"
      >
        <template #label
          ><a-tooltip
            ><template #title>{{ description.tooltip }}</template
            ><question-circle-outlined class="mr-4px" /></a-tooltip
          >{{ description.label }}:</template
        >
        <template v-if="description.label === 'Status'"></template>
        <template v-else-if="description.label === 'Transactions'">
          <RouterLink
            :to="`/explorer-transaction-list?block=${props.block.number}`"
            >{{ props.block.transactions.length }} transactions</RouterLink
          >
        </template>
        <template v-else-if="description.label === 'Fee Recipient'">
          <RouterLink :to="`/explorer-address/${props.block.miner}`">{{
            props.block.miner
          }}</RouterLink>
        </template>
        <template v-else>
          {{ description.content }}
        </template>
      </description-item>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, computed, ref, watchEffect, toRefs } from 'vue'
import DescriptionItem from '@/pages/explorer/components/description-item.vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import useBlock from '@/hook/blockHook'
const { getGasUsed, getGasLimit, getGasUsePecent, getBaseFeePerGas } =
  useBlock()
const props = defineProps(['block'])
const descriptions = computed(() => {
  console.log(props.block)
  return (
    (props.block && [
      {
        label: 'BlockHeight',
        tooltip:
          'Also known as Block Number.The block height,which indicates the length of the blockchain,increases after the addition of the new block',
        content: props.block.number,
      },
      {
        label: 'Status',
        tooltip: '',
      },
      {
        label: 'Timestamp',
        tooltip: '',
      },
      {
        label: 'Proposed On',
        tooltip: '',
      },
      {
        label: 'Transactions',
      },
      {
        label: 'Fee Recipient',
      },
      {
        label: 'Block Reward',
      },
      {
        label: 'Total Difficulty',
      },
      {
        label: 'Size',
      },
      {
        label: 'Gas Used',
        content: getGasUsed(props.block),
      },
      {
        label: 'Gas Limit',
      },
      {
        label: 'Base Fee Per Gas',
      },
      {
        label: 'Burnt Fees',
      },
      {
        label: 'Extra Data',
      },
      {
        label: 'Hash',
      },
      {
        label: 'Parent Hash',
      },
      {
        label: 'StateRoot',
      },
      {
        label: 'Nonce',
      },
    ]) ||
    []
  )
})
</script>
